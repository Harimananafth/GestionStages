// src/controllers/FileController.js

const { cloudinary } = require("../config/cloudinary.config");
const { Etudiant, Offre, Candidature } = require("../Models");

class FileController {
  // Méthode pour obtenir l'URL sécurisée d'un document
  static async getDocument(req, res) {
    const { idCandidature } = req.params;
    const { type } = req.query; // 'cv' ou 'lm'
    const UtilisateurIdConnecte = req.user.id;

    if (type !== "cv" && type !== "lm") {
      return res.status(400).json({
        message: "Type de document non valide. Utilisez 'cv' ou 'lm'.",
      });
    }

    try {
      const candidature = await Candidature.findByPk(idCandidature);
      if (!candidature) {
        return res.status(404).json({ message: "Candidature introuvable." });
      }

      // Trouver l'étudiant lié pour vérification
      const etudiant = await Etudiant.findByPk(candidature.EtudiantId);
      if (!etudiant) {
        return res.status(404).json({ message: "Étudiant lié introuvable." });
      }

      // 1. Définir les règles d'autorisation
      let isAuthorized = false;
      if (etudiant.UtilisateurId === UtilisateurIdConnecte) {
        isAuthorized = true;
      }
      if (req.user.roles.includes("admin")) {
        isAuthorized = true;
      }

      if (!isAuthorized) {
        return res
          .status(403)
          .json({ message: "Accès non autorisé à ce document." });
      }

      // 2. Récupérer l'ID PUBLIC
      const publicId =
        type === "cv" ? candidature.cv_public_id : candidature.lm_public_id;
      const fullPath =
        type === "cv" ? candidature.cv_path : candidature.lm_path;

      if (!publicId) {
        return res
          .status(404)
          .json({ message: `ID public du document (${type}) introuvable.` });
      }

      const resourceType =
        fullPath && fullPath.endsWith(".pdf") ? "raw" : "image";

      // 3. GÉNÉRER L'URL SÉCURISÉE AVEC EXPIRATION
      const expirationTimestamp = Math.floor(Date.now() / 1000) + 300;

      const secureUrl = cloudinary.url(publicId, {
        resource_type: "image",
        secure: true,
        sign_url: true,
        expires_at: expirationTimestamp,
        type: "private",
      });

      console.log(`URL signée et expirant dans 30s générée : ${secureUrl}`);

      // 4. Rediriger l'utilisateur vers l'URL Cloudinary
      return res.redirect(302, secureUrl);
    } catch (error) {
      console.error("Erreur lors de l'accès au document :", error);
      return res.status(500).json({
        message: "Erreur serveur lors de la récupération du document.",
      });
    }
  }
}

module.exports = FileController;
