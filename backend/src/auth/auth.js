require("../auth/google");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require('bcrypt');
const { Utilisateur } = require('../Models')

class Auth{

    static async generateToken(user) {
        return jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
    }


    static async callback(req, res) {
        let user, googleProfile, isNew;

        if (req.user && req.user.isNew !== undefined) {
            ({ user, googleProfile, isNew } = req.user);
        } 
        else {
            user = req.user;
            isNew = false;
        }

        if (isNew) {
            res.cookie("google_temp", JSON.stringify({
            email: googleProfile.emails[0].value,
            name: googleProfile.displayName,
            googleId: googleProfile.id,
            photo: googleProfile.photos[0].value
            }), {
            httpOnly: true,
            maxAge: 10 * 60 * 1000 // 10 min
            });

            return res.redirect("http://localhost:5173/auth/set-password");
        }

        const token = await Auth.generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.PROD_COOKIE_SECURE || false, 
            sameSite: process.env.PROD_SAME_SITE || "lax",
            maxAge: 24 * 60 * 60 * 1000, 
        });

        res.redirect(
            `http://localhost:5173/auth/login-success?id=${encodeURIComponent(
                user.id 
            )}&email=${encodeURIComponent(user.email)}`
        );
    }

    static async registerGoogle(req, res) {
        try {
            if (!req.cookies.google_temp) {
                return res.status(400).json({ error: "Aucune donnée temporaire trouvée. Veuillez recommencer la connexion Google." });
            }

            const tempUser = JSON.parse(req.cookies.google_temp);
            const { password } = req.body;

            if (!password) {
                return res.status(400).json({ error: "Le mot de passe est requis." });
            }

            const passwordHash = bcrypt.hashSync(password, 10);

            const newUser = await Utilisateur.create({ ...tempUser, password: passwordHash });

            const token = await Auth.generateToken(newUser);

            res.clearCookie("google_temp");
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.PROD_COOKIE_SECURE || false, 
                sameSite: process.env.PROD_SAME_SITE || "lax",
                maxAge: 24 * 60 * 60 * 1000, 
            });

            const { password: _, ...userData } = newUser.toJSON();

            res.json({ success: true, data: userData });
            } catch (err) {
                console.error(err);
                const message = `L'inscription a échouée. Réessayez dans quelques instants.`;
                return res.status(500).json({ message, data: err });
            }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const utilisateur = await Utilisateur.findOne({ where: { email } });

            if (!utilisateur) {
            return res.status(404).json({ message: "L'utilisateur demandé n'existe pas." });
            }

            const isPasswordValid = await bcrypt.compare(password, utilisateur.password);
            if (!isPasswordValid) {
            return res.status(401).json({ message: "Le mot de passe est incorrect." });
            }

            const token = await Auth.generateToken(utilisateur);

            res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.PROD_COOKIE_SECURE || false, 
            sameSite: process.env.PROD_SAME_SITE || "lax",
            maxAge: 24 * 60 * 60 * 1000, 
            });

            return res.status(200).json({
            message: "Connexion réussie !",
            user: {
                id: utilisateur.id,
                name: utilisateur.name,
                email: utilisateur.email,
            },
            token
            });

        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            return res.status(500).json({
            message: "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
            error: error.message,
            });
        }
    }
    static async register(req, res) {
        try {
            const { email, password } = req.body;

            const utilisateur = await Utilisateur.findOne({ where: { email } });
            if (utilisateur) {
                return res.status(401).json({ message: "Cet email est déjà utilisé" });
            }

            const passwordHash = bcrypt.hashSync(password, 10);
            const newUser = await Utilisateur.create({email, password: passwordHash});

            const token = await Auth.generateToken(newUser);

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.PROD_COOKIE_SECURE === "true", 
                sameSite: process.env.PROD_SAME_SITE || "lax",
                maxAge: 24 * 60 * 60 * 1000, 
            });

            return res.status(200).json({
                message: "Inscription réussie !",
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                },
                token,
            });

        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            return res.status(500).json({
                message: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
                error: error.message,
            });
        }
    }

    static async logout(req, res) {
        res.clearCookie("token");
        res.json({ message: "Déconnexion réussie." });
    }

}

module.exports = Auth