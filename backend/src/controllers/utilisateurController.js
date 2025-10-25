const {
  ValidationError,
  UniqueConstraintError,
  Sequelize,
} = require("sequelize");
const { Utilisateur } = require("../Models");
const bcrypt = require("bcrypt");
const { cloudinary } = require("../config/cloudinary.config");

class UtilisateurController {
  // Méthode pour créer un nouvel utilisateur (inchangée)
  static async createUtilisateur(req, res) {
    try {
      const utilisateur = await Utilisateur.sequelize.transaction(async (t) => {
        const { password, ...reste } = req.body;
        const passwordHash = bcrypt.hashSync(password, 10);

        return await Utilisateur.create(
          { ...reste, password: passwordHash },
          { transaction: t }
        );
      });

      const message = `L'utilisateur a été créé avec succès.`;
      res.json({ message, data: utilisateur });
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof UniqueConstraintError
      ) {
        return res.status(400).json({ message: error.message, data: error });
      }

      const message = `L'utilisateur n'a pas pu être créé. Réessayez dans quelques instants.`;
      res.status(500).json({ message, data: error });
    }
  }

  // Méthode pour mettre à jour UNIQUEMENT la photo de profil (corrigée)
  static async updateUtilisateurPhoto(req, res) {
    const id = req.params.id; // C'est l'ID de l'Utilisateur

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier d'image n'a été fourni." });
    }

    let photoUrl = null;

    try {
      // 1. Conversion du Buffer en Data URI pour l'upload Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      // 2. Upload sur Cloudinary (L'image est publique par défaut)
      const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "profile_photos",

        // --- CORRECTION (OPTIMISATION) ---
        // Le frontend envoie déjà une image carrée recadrée.
        // On évite 'crop: "fill"' et 'gravity: "face"' qui sont inutiles et
        // pourraient recadrer à nouveau une image déjà parfaite.
        // 'limit' redimensionne l'image pour qu'elle tienne dans 300x300.
        transformation: [{ width: 300, height: 300, crop: "limit" }],

        resource_type: "image",
      });

      photoUrl = cloudinaryResponse.secure_url;

      // 3. Mettre à jour la BDD (modèle Utilisateur)
      const [affectedRows] = await Utilisateur.update(
        { photo: photoUrl },
        { where: { id } }
      );

      if (affectedRows === 0) {
        return res
          .status(404)
          .json({ message: `Utilisateur avec l'ID ${id} non trouvé.` });
      }

      // 4. Réponse réussie : Renvoyer la nouvelle URL de la photo
      return res.json({
        message: "Photo de profil mise à jour avec succès.",
        data: { photo: photoUrl }, // Le frontend utilisera cette URL
      });
    } catch (error) {
      console.error("Erreur Cloudinary ou BDD:", error);
      const message = `Échec de la mise à jour de la photo de l'utilisateur ${id}. Réessayez.`;
      return res.status(500).json({ message, error: error.message });
    }
  }

  // Méthode pour supprimer un utilisateur (inchangée)
  static async deleteUtilisateur(req, res) {
    const id = parseInt(req.params.id);

    try {
      const utilisateur = await Utilisateur.sequelize.transaction(async (t) => {
        const utilisateur = await Utilisateur.findByPk(id, { transaction: t });

        if (!utilisateur) {
          throw new Error("not_found");
        }

        await Utilisateur.destroy({ where: { id }, transaction: t });
        return utilisateur;
      });

      const message = `L'utilisateur ${utilisateur.email} a bien été supprimé.`;
      res.json({ message, data: utilisateur });
    } catch (error) {
      if (error.message === "not_found") {
        return res
          .status(404)
          .json({ message: `L'utilisateur demandé n'existe pas.` });
      }

      const message = `L'utilisateur n'a pas pu être supprimé. Réessayez dans quelques instants.`;
      res.status(500).json({ message, data: error });
    }
  }

  static async updateByEmail(email, fields) {
    const utilisateur = await Utilisateur.findOne({ where: { email } });
    if (!utilisateur) throw new Error("not_found");

    if (
      fields.password &&
      !bcrypt.compareSync(fields.password, utilisateur.password)
    ) {
      fields.password = bcrypt.hashSync(fields.password, 10);
    }

    await utilisateur.update(fields);
    return utilisateur;
  }
}

module.exports = UtilisateurController;
