const {
  ValidationError,
  UniqueConstraintError,
  Sequelize,
} = require("sequelize");
const { Utilisateur } = require("../Models");
const bcrypt = require("bcrypt");
const { cloudinary } = require("../config/cloudinary.config");

// Utilitaire pour extraire le public_id d'une URL Cloudinary
function getPublicIdFromUrl(url) {
  if (!url) return null;
  // Regex pour capturer le public_id (avec dossier, sans extension)
  const regex = /(?:.*\/upload\/(?:v\d+\/)?)(.*)\.(?:[a-zA-Z0-9]+)$/;
  const match = url.match(regex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  console.warn("N'a pas pu extraire le public_id de l'URL:", url);
  return null;
}

class UtilisateurController {
  // Méthode pour créer un nouvel utilisateur
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

  // Méthode pour mettre à jour UNIQUEMENT la photo de profil
  static async updateUtilisateurPhoto(req, res) {
    const id = req.params.id; // id utilisateur
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Aucun fichier d'image n'a été fourni." });
    }

    let newPhotoUrl = null;
    let oldPhotoPublicId = null;

    try {
      // 1. Récupérer l'utilisateur et l'URL de son ancienne photo
      const utilisateur = await Utilisateur.findByPk(id);
      if (!utilisateur) {
        return res
          .status(404)
          .json({ message: `Utilisateur avec l'ID ${id} non trouvé.` });
      }

      // 2. Extraire le public_id de l'ancienne photo (si elle existe)
      if (utilisateur.photo) {
        oldPhotoPublicId = getPublicIdFromUrl(utilisateur.photo);
      }

      // 3. Conversion du Buffer en Data URI pour l'upload
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

      // 4. Upload de la NOUVELLE photo sur Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "profile_photos",
        transformation: [{ width: 300, height: 300, crop: "limit" }],
        resource_type: "image",
        // Assurer un nom unique pour éviter les collisions de cache
        public_id: `user_${id}_${Date.now()}`,
      });

      newPhotoUrl = cloudinaryResponse.secure_url;

      // 5. Mettre à jour la BDD (modèle Utilisateur)
      await utilisateur.update({ photo: newPhotoUrl });

      // 6. Supprimer l'ancienne photo de Cloudinary (si elle existait)
      if (oldPhotoPublicId) {
        cloudinary.uploader
          .destroy(oldPhotoPublicId, { resource_type: "image" })
          .then((result) =>
            console.log("Ancienne photo supprimée de Cloudinary:", result)
          )
          .catch((err) =>
            console.error("Échec de la suppression de l'ancienne photo:", err)
          );
      }

      // 7. Réponse réussie
      return res.json({
        message: "Photo de profil mise à jour avec succès.",
        data: { photo: newPhotoUrl }, // Le frontend utilisera cette URL
      });
    } catch (error) {
      console.error("Erreur Cloudinary ou BDD:", error);
      const message = `Échec de la mise à jour de la photo de l'utilisateur ${id}. Réessayez.`;
      return res.status(500).json({ message, error: error.message });
    }
  }

  // Méthode pour supprimer un utilisateur
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
