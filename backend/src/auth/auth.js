require("../auth/google");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Utilisateur, Role, UtilisateurRole } = require('../Models');
const UtilisateurController  = require('../controllers/utilisateurController');
const { sendMail } = require('../utils/mailer');

class Auth {

    // Générer JWT avec roles
    static async generateToken(user) {
        const roles = await user.getRoles({ attributes: ['libelle'] });
        const roleNames = roles.map(r => r.libelle);

        return jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: roleNames
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
    }

    static randomCode() {
        return Math.floor(10000 + Math.random() * 90000).toString();
    }

    // CALLBACK Google
    static async callback(req, res) {
        let user, googleProfile, isNew;

        if (req.user && req.user.isNew !== undefined) {
            ({ user, googleProfile, isNew } = req.user);
        } else {
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

        const roles = await user.getRoles({ attributes: ['libelle'] });
        const roleNames = roles.map(r => r.libelle);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.PROD_COOKIE_SECURE || false,
            sameSite: process.env.PROD_SAME_SITE || "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.redirect(
            `http://localhost:5173/auth/login-success?id=${encodeURIComponent(user.id)}&email=${encodeURIComponent(user.email)}&roles=${encodeURIComponent(JSON.stringify(roleNames))}`
        );
    }

    // REGISTER Google après set password
    static async registerGoogle(req, res) {
        try {
            if (!req.cookies.google_temp) {
                return res.status(400).json({ error: "Aucune donnée temporaire trouvée. Veuillez recommencer la connexion Google." });
            }

            const tempUser = JSON.parse(req.cookies.google_temp);
            const { password } = req.body;

            if (!password) return res.status(400).json({ error: "Le mot de passe est requis." });

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
            return res.status(500).json({ message: "L'inscription a échouée. Réessayez dans quelques instants.", data: err });
        }
    }

    // LOGIN
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const utilisateur = await Utilisateur.findOne({ where: { email } });

            if (!utilisateur) return res.status(404).json({ message: "L'utilisateur demandé n'existe pas." });

            const isPasswordValid = await bcrypt.compare(password, utilisateur.password);
            if (!isPasswordValid) return res.status(401).json({ message: "Le mot de passe est incorrect." });

            const roles = await utilisateur.getRoles({ attributes: ['libelle'] });
            const roleNames = roles.map(r => r.libelle);

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
                    roles: roleNames
                },
                token
            });

        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            return res.status(500).json({ message: "Une erreur est survenue lors de la connexion. Veuillez réessayer.", error: error.message });
        }
    }

    // REGISTER : ne crée pas l'utilisateur, juste stockage temporaire
    static async register(req, res) {
        const { email, password } = req.body;

        try {
            // Vérifier si l'email existe déjà dans la base
            const existingUser = await Utilisateur.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email déjà utilisé' });
            }

            if (!password || !email) {
                return res.status(400).json({ message: 'Champs requis manquants' });
            }

            // Hasher le mot de passe
            const hash = await bcrypt.hash(password, 10);

            // Générer le code OTP
            const code = Auth.randomCode();
            const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

            // Stocker temporairement dans un cookie sécurisé
            res.cookie('signup_temp', JSON.stringify({
                email,  passwordHash: hash, verificationCode: code, verificationExpires: expires
            }), {
                httpOnly: true,
                maxAge: 10 * 60 * 1000, // 10 min
                secure: process.env.PROD_COOKIE_SECURE || false,
                sameSite: 'lax'
            });

            // Envoyer le code par mail
            await sendMail({ to: email, subject: 'Code de vérification', text: `Votre code: ${code} (valide 5 minutes)` });

            res.json({ message: 'Code de vérification envoyé par e-mail.' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
        }
    }


    // VERIFY CODE : création de l'utilisateur seulement après vérification
    static async verifyCode(req, res) {
        const { code } = req.body;

        try {
            if (!req.cookies.signup_temp) {
                return res.status(400).json({ message: 'Aucune inscription en cours ou expirée. Veuillez recommencer.' });
            }

            const tempData = JSON.parse(req.cookies.signup_temp);

            // Vérifier le code et la date d'expiration
            if (tempData.verificationCode !== code || new Date(tempData.verificationExpires) < new Date()) {
                return res.status(400).json({ message: 'Code invalide ou expiré' });
            }

            // Créer l'utilisateur réel dans la base
            const newUser = await Utilisateur.create({
                email: tempData.email,
                password: tempData.passwordHash,
                isVerified: true
            });

            // Supprimer le cookie temporaire
            res.clearCookie('signup_temp');

            // Générer JWT
            const token = await Auth.generateToken(newUser);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.PROD_COOKIE_SECURE || false,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.json({
                message: 'Inscription validée avec succès !',
                user: { id: newUser.id, email: newUser.email, name: newUser.name, roles: [] }
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erreur serveur lors de la vérification.' });
        }
    }


    // RESEND CODE pour inscription temporaire
    static async resendCode(req, res) {
        try {
            if (!req.cookies.signup_temp) {
                return res.status(400).json({ message: 'Aucune inscription en cours ou expirée. Veuillez recommencer.' });
            }

            // Récupérer les données temporaires
            const tempData = JSON.parse(req.cookies.signup_temp);

            // Générer un nouveau code et mettre à jour la date d'expiration
            const newCode = Auth.randomCode();
            const newExpires = new Date(Date.now() + 5 * 60 * 1000);

            tempData.verificationCode = newCode;
            tempData.verificationExpires = newExpires;

            // Mettre à jour le cookie temporaire
            res.cookie('signup_temp', JSON.stringify(tempData), {
                httpOnly: true,
                maxAge: 10 * 60 * 1000,
                secure: process.env.PROD_COOKIE_SECURE || false,
                sameSite: 'lax'
            });

            // Envoyer le nouveau code par mail
            await sendMail({
                to: tempData.email,
                subject: 'Nouveau code de vérification',
                text: `Votre nouveau code : ${newCode} (valide 5 minutes)`
            });

            res.json({ message: 'Nouveau code envoyé par e-mail.' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erreur serveur lors de la réémission du code.' });
        }
    }

}

module.exports = Auth;
