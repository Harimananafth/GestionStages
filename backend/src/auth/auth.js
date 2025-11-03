require("../auth/google");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const { Utilisateur, Role } = require("../models");
const { sendVerificationMail } = require("../utils/mailer");

class Auth {
  static FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173/";
  static isProd = process.env.PROD_COOKIE_SECURE === "true";

  // Options des cookies centralisées
  static cookieOptions(maxAge = 24 * 60 * 60 * 1000) {
    return {
      httpOnly: true,
      secure: this.isProd,
      sameSite: this.isProd ? "None" : "Lax",
      maxAge,
    };
  }

  // Générer JWT avec roles
  static async generateToken(user) {
    const roles = await user.getRoles({ attributes: ["libelle"] });
    const roleNames = roles.map((r) => r.libelle);
    return jwt.sign(
      { id: user.id, name: user.name, email: user.email, roles: roleNames },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  }

  static randomCode() {
    return Math.floor(10000 + Math.random() * 90000).toString();
  }

  // CALLBACK google
  static async callback(req, res) {
    let { user, isNew, googleProfile } = req.user || {};

    if (isNew && googleProfile) {
      const googleId = uuidv4();
      res.cookie(
        "google_temp",
        JSON.stringify({
          email: googleProfile.emails[0].value,
          name: googleProfile.displayName,
          googleId,
          photo: googleProfile.photos[0].value,
        }),
        { httpOnly: true, maxAge: 10 * 60 * 1000 }
      );
      return res.redirect(`${this.FRONTEND_URL}auth/sign-up/set-password`);
    }

    const updates = {};
    if (googleProfile) {
      updates.name = googleProfile.displayName;
      updates.photo = googleProfile.photos[0].value;
      updates.isVerified = true;
    }
    if (!user.googleId) {
      updates.googleId = uuidv4();
    }

    if (Object.keys(updates).length > 0) {
      await user.update(updates);
    }

    const token = await Auth.generateToken(user);
    const roles = await user.getRoles({ attributes: ["libelle"] });
    const roleNames = roles.map((r) => r.libelle);

    res.cookie("token", token, Auth.cookieOptions());
    res.redirect(
      `${this.FRONTEND_URL}auth/login-success?id=${
        user.id
      }&email=${encodeURIComponent(user.email)}&roles=${encodeURIComponent(
        JSON.stringify(roleNames)
      )}&photo=${encodeURIComponent(user.photo)}`
    );
  }

  // REGISTER Google après set password
  static async registerGoogle(req, res) {
    try {
      if (!req.cookies.google_temp)
        return res
          .status(400)
          .json({ error: "Données temporaires manquantes." });

      const tempUser = JSON.parse(req.cookies.google_temp);
      const { password } = req.body;
      if (!password)
        return res.status(400).json({ error: "Mot de passe requis." });

      const passwordHash = bcrypt.hashSync(password, 10);
      const newUser = await Utilisateur.create({
        ...tempUser,
        password: passwordHash,
        isVerified: true,
      });

      // Assignation d'un rôle par défaut
      const defaultRole = await Role.findOne({ where: { libelle: "user" } });
      if (defaultRole) await newUser.addRole(defaultRole);

      const token = await Auth.generateToken(newUser);
      res.clearCookie("google_temp");
      res.cookie("token", token, Auth.cookieOptions());

      const roles = await newUser.getRoles({ attributes: ["libelle"] });
      const roleNames = roles.map((r) => r.libelle);

      return res.status(200).json({
        message: "Inscription validée !",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          roles: roleNames,
          photo: newUser.photo,
        },
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Inscription échouée.", data: err });
    }
  }

  // LOGIN
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const utilisateur = await Utilisateur.findOne({ where: { email } });
      if (!utilisateur)
        return res.status(404).json({ message: "Utilisateur inexistant." });

      const isPasswordValid = await bcrypt.compare(
        password,
        utilisateur.password
      );
      if (!isPasswordValid)
        return res.status(401).json({ message: "Mot de passe incorrect." });

      const token = await Auth.generateToken(utilisateur);
      res.cookie("token", token, Auth.cookieOptions());

      const roles = await utilisateur.getRoles({ attributes: ["libelle"] });
      const roleNames = roles.map((r) => r.libelle);

      const user = {
        id: utilisateur.id,
        name: utilisateur.name,
        email: utilisateur.email,
        roles: roleNames,
        photo: utilisateur.photo,
      };
      return res.status(200).json({
        message: "Connexion réussie !",
        user,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la connexion.", error: err.message });
    }
  }

  // REGISTER classique
  static async register(req, res) {
    const { email, password } = req.body;
    try {
      if (!email || !password)
        return res.status(400).json({ message: "Champs requis manquants." });

      const existingUser = await Utilisateur.findOne({ where: { email } });
      if (existingUser)
        return res.status(400).json({ message: "Email déjà utilisé." });

      const passwordHash = await bcrypt.hash(password, 10);
      const code = Auth.randomCode();
      const expires = new Date(Date.now() + 5 * 60 * 1000);

      res.cookie(
        "signup_temp",
        JSON.stringify({
          email,
          passwordHash,
          verificationCode: code,
          verificationExpires: expires,
        }),
        {
          httpOnly: true,
          maxAge: 10 * 60 * 1000,
          secure: process.env.PROD_COOKIE_SECURE === "true",
          sameSite: "lax",
        }
      );

      await sendVerificationMail(email, code)
        .then(() => console.log("Email envoyé !"))
        .catch(console.error);
      res.json({ message: "Code envoyé par e-mail." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur lors de l'inscription." });
    }
  }

  // VERIFY CODE
  static async verifyCode(req, res) {
    const { code } = req.body;
    try {
      if (!req.cookies.signup_temp)
        return res.status(400).json({ message: "Inscription expirée." });

      const tempData = JSON.parse(req.cookies.signup_temp);
      if (
        tempData.verificationCode !== code ||
        new Date(tempData.verificationExpires) < new Date()
      )
        return res.status(400).json({ message: "Code invalide ou expiré." });

      const newUser = await Utilisateur.create({
        email: tempData.email,
        password: tempData.passwordHash,
        isVerified: true,
        photo: "/images/default-img-profil.png",
      });
      res.clearCookie("signup_temp");

      // Assignation rôle par défaut
      const defaultRole = await Role.findOne({ where: { libelle: "user" } });
      if (defaultRole) await newUser.addRole(defaultRole);

      const token = await Auth.generateToken(newUser);
      res.cookie("token", token, Auth.cookieOptions(7 * 24 * 60 * 60 * 1000)); // 7 jours

      const roles = await newUser.getRoles({ attributes: ["libelle"] });
      const roleNames = roles.map((r) => r.libelle);

      return res.status(200).json({
        message: "Inscription validée !",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          roles: roleNames,
          photo: newUser.photo,
        },
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la vérification." });
    }
  }

  // RESEND CODE
  static async resendCode(req, res) {
    try {
      if (!req.cookies.signup_temp)
        return res.status(400).json({ message: "Inscription expirée." });

      const tempData = JSON.parse(req.cookies.signup_temp);
      const newCode = Auth.randomCode();
      tempData.verificationCode = newCode;
      tempData.verificationExpires = new Date(Date.now() + 5 * 60 * 1000);

      res.cookie("signup_temp", JSON.stringify(tempData), {
        httpOnly: true,
        maxAge: 10 * 60 * 1000,
        secure: process.env.PROD_COOKIE_SECURE === "true",
        sameSite: "lax",
      });

      await sendVerificationMail(tempData.email, newCode)
        .then(() => console.log("Email envoyé !"))
        .catch(console.error);
      res.json({ message: "Nouveau code envoyé par e-mail." });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la réémission du code." });
    }
  }

  // Check cookie
  static async check(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) return res.status(401).json({ message: "Non authentifié." });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.json({
        message: "Utilisateur authentifié.",
        user: decoded,
      });
    } catch (err) {
      return res.status(401).json({ message: "Token invalide ou expiré." });
    }
  }

  // LOGOUT
  static async logout(req, res) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: this.isProd,
      sameSite: this.isProd ? "None" : "Lax",
    });
    res.json({ message: "Déconnecté avec succès." });
  }
}

module.exports = Auth;
