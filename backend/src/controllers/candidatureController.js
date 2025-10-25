const {
  Candidature,
  Offre,
  Utilisateur,
  Etudiant,
  Profil,
  OffreProfil,
  Role,
  UtilisateurRole,
  sequelize,
} = require("../Models");
const { ValidationError, Op, where } = require("sequelize");
const notificationController = require("./notificationController");
const { cloudinary } = require("../config/cloudinary.config");
const fs = require("fs");
const {
  sendAdminCandidatureNotification,
  sendStudentStatusUpdate,
} = require("../utils/mailer");

// Fonction Helper pour vérifier et fermer une offre
async function checkAndCloseOffre(offreId, transaction) {
  const offre = await Offre.findByPk(offreId, {
    include: [
      {
        model: Profil,
        attributes: ["id"],
        through: { attributes: ["nbProfil"] },
      },
    ],
    transaction,
  });

  if (!offre || !offre.Profils) return;

  let totalPlacesRestantes = 0;

  // Boucler sur tous les profils requis par l'offre
  for (const profil of offre.Profils) {
    const totalSpots = profil.OffreProfil.nbProfil;

    // 2. Compter les acceptés pour ce profil
    const acceptedCount = await Candidature.count({
      where: {
        OffreId: offreId,
        ProfilId: profil.id,
        statut: "Acceptée",
      },
      transaction,
    });

    // Ajouter les places restantes de ce profil au total
    const remainingSpots = totalSpots - acceptedCount;
    if (remainingSpots > 0) {
      totalPlacesRestantes += remainingSpots;
    }
  }

  // Si 0 places restantes au total (tous profils confondus), fermer l'offre
  if (totalPlacesRestantes === 0) {
    offre.is_disponible = false;
    await offre.save({ transaction });
  }
  // Si on refuse une candidature, on pourrait rouvrir l'offre
  else if (totalPlacesRestantes > 0 && !offre.is_disponible) {
    offre.is_disponible = true;
    await offre.save({ transaction });
  }
}

class CandidatureController {
  // Méthode pour lister toutes les candidatures

  static async getAllcandidature(req, res) {
    try {
      const candidatures = await Candidature.findAll({
        include: [
          {
            model: Etudiant,
            attributes: ["id", "nom", "prenom", "ecole", "niveau"],
            include: [
              {
                model: Utilisateur,
                attributes: ["photo", "email"],
              },
            ],
          },
          {
            model: Profil,
            attributes: ["nomProfil"],
          },
          {
            model: Offre,
            attributes: ["titre"],
          },
        ],
      });

      const data = candidatures.map((c) => ({
        idCandidature: c.id,
        nom: `${c.Etudiant.nom} ${c.Etudiant.prenom}`,
        titre: c.Offre.titre,
        profilPostule: c.Profil ? c.Profil.nomProfil : "N/A",
        date_depot: c.date_candidature,
        ecole: c.Etudiant.ecole,
        niveau: c.Etudiant.niveau,
        statut: c.statut,
      }));

      const message = "Les candidatures ont été récupérées avec succès.";
      return res.json({ message, data });
    } catch (error) {
      console.error(error);
      const message =
        "Les candidatures n'ont pas pu être récupérées. Réessayez plus tard.";
      return res.status(500).json({ message, data: error.message });
    }
  }

  // Méthode pour créer une candidature
  static async createCandidature(req, res) {
    const cvFile = req.files["cv"]?.[0] || null;
    const lmFile = req.files["lm"]?.[0] || null;
    let cvResult, lmResult; // stocker les résultats d'upload

    if (!cvFile || !lmFile) {
      return res
        .status(400)
        .json({ message: "CV et lettre de motivation requis." });
    }

    try {
      // --- 1 & 2. Uploader le CV et la LM sur Cloudinary ---
      cvResult = await cloudinary.uploader.upload(cvFile.path, {
        folder: "candidatures/cv",
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
        overwrite: false,
        type: "private",
      });

      lmResult = await cloudinary.uploader.upload(lmFile.path, {
        folder: "candidatures/lm",
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
        overwrite: false,
        type: "private",
      });

      // 3. Récupérer les données de Cloudinary
      const cv_path = cvResult.secure_url;
      const lm_path = lmResult.secure_url;
      const cv_public_id = cvResult.public_id;
      const lm_public_id = lmResult.public_id;

      // Récupération des ID pour validation
      const { OffreId, ProfilId } = req.body;
      const body = req.body;

      // 4. Exécuter la transaction (DB)
      const candidature = await sequelize.transaction(async (t) => {
        const offre = await Offre.findByPk(OffreId, { transaction: t });
        if (!offre) throw new Error("offre_not_found");
        if (!offre.is_disponible) throw new Error("offre_not_disponible");

        const offreProfil = await OffreProfil.findOne({
          where: { OffreId, ProfilId },
          transaction: t,
        });
        if (!offreProfil) throw new Error("profil_not_in_offre");

        const newCandidature = await Candidature.create(
          {
            ...body,
            cv_path, // L'URL privée
            lm_path, // L'URL privée
            cv_public_id,
            lm_public_id,
          },
          { transaction: t }
        );

        // --- DEBUT : Logique d'envoi d'email  ---

        await notificationController.addNotification({
          UtilisateurId: null, // pour l'admin
          message: `Une candidature a été postée pour l'offre ${offre.titre}`,
          type: "simple",
          date_reception: new Date(),
        });

        // 1. Trouver le rôle 'admin'
        const adminRoles = await Role.findAll({
          where: { libelle: "admin" },
          transaction: t,
        });
        const adminRole = adminRoles[0]; // Prend le premier résultat

        if (adminRole) {
          // 2. Trouver tous les utilisateurs ayant ce rôle
          const utilisateursRoles = await UtilisateurRole.findAll({
            where: { id_role: adminRole.id },
            include: [{ model: Utilisateur }],
            transaction: t,
          });

          // 3. Récupérer l'étudiant
          const etudiant = await Etudiant.findOne({
            where: { UtilisateurId: req.user.id },
            transaction: t,
          });
          const nomComplet = etudiant
            ? `${etudiant.nom} ${etudiant.prenom}`
            : "Étudiant inconnu";

          // 4. Envoyer les emails aux admins
          const emailPromises = utilisateursRoles
            .map((ur) => ur.Utilisateur?.email) // Extrait l'email (si l'inclusion a réussi)
            .filter((email) => email) // Filtre les emails nulls/vides
            .map((email) =>
              sendAdminCandidatureNotification(email, nomComplet, offre.titre)
            );

          // Utilisation de Promise.all pour s'assurer que tous les envois sont lancés avant de continuer
          await Promise.all(emailPromises)
            .then(() =>
              console.log(
                `Emails de notification envoyés à ${emailPromises.length} administrateurs.`
              )
            )
            .catch((e) =>
              console.error(
                "Erreur lors de l'envoi des emails administrateur:",
                e
              )
            );
        } else {
          console.warn(
            "Rôle 'admin' non trouvé. Notification par email non envoyée."
          );
        }

        // --- FIN : Logique d'envoi d'email corrigée ---

        return newCandidature;
      });

      // 5. (Nettoyage) Supprimer les fichiers temporaires APRES le succès de la transaction
      fs.unlinkSync(cvFile.path);
      fs.unlinkSync(lmFile.path);

      const message = `La candidature a été postée avec succès.`;
      return res.status(201).json({ message, data: candidature });
    } catch (error) {
      console.error(error);

      // Nettoyage : si l'upload Cloudinary a réussi mais la transaction a échoué

      if (cvResult && cvResult.public_id) {
        // Tente de supprimer le CV si l'upload a réussi

        await cloudinary.uploader.destroy(cvResult.public_id, {
          resource_type: "auto",
        });
      }

      if (lmResult && lmResult.public_id) {
        // Tente de supprimer la LM si l'upload a réussi

        await cloudinary.uploader.destroy(lmResult.public_id, {
          resource_type: "auto",
        });
      }

      // Nettoyage : Suppression des fichiers temporaires (quel que soit le résultat)

      if (cvFile && cvFile.path) fs.unlinkSync(cvFile.path);
      if (lmFile && lmFile.path) fs.unlinkSync(lmFile.path);

      // Gestion des erreurs

      if (error.message === "offre_not_found") {
        return res.status(404).json({ message: "Offre introuvable." });
      }

      if (error.message === "offre_not_disponible") {
        return res.status(403).json({
          message: "Cette offre n'est plus disponible pour les candidatures.",
        });
      }

      if (error.message === "profil_not_in_offre") {
        return res
          .status(400)
          .json({ message: "Ce profil n'est pas requis pour cette offre." });
      }

      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }

      console.error(error);

      return res.status(500).json({
        message: `La candidature n'a pas pu être créée. Réessayez dans quelques instants.`,
        data: error,
      });
    }
  }

  // Méthode pour modifier une candidature

  static async updateCandidature(req, res) {
    const id = parseInt(req.params.id);

    try {
      const updatedCandidature = await sequelize.transaction(async (t) => {
        const [affectedRows] = await Candidature.update(req.body, {
          where: { id },
          transaction: t,
        });

        if (!affectedRows) throw new Error("not_found");

        return await Candidature.findByPk(id, { transaction: t });
      });

      const message = `La candidature a été mise à jour avec succès.`;

      return res.json({ message, data: updatedCandidature });
    } catch (error) {
      if (error.message === "not_found") {
        return res.status(404).json({ message: "Candidature introuvable." });
      }

      if (error instanceof ValidationError) {
        return res.status(400).json({ message: error.message, data: error });
      }

      const message = `La candidature n'a pas pu être mise à jour. Réessayez dans quelques instants.`;

      return res.status(500).json({ message, data: error });
    }
  }

  // Méthode pour modifier uniquement le statut d'une candidature
  static async updateCandidatureStatus(req, res) {
    const id = parseInt(req.params.id);
    const { statut } = req.body;

    try {
      const updatedCandidature = await sequelize.transaction(async (t) => {
        const candidature = await Candidature.findByPk(id, {
          // Inclure l'offre pour la vérification
          include: [Offre],
          transaction: t,
        });

        if (!candidature) throw new Error("candidature_not_found");

        // Si le statut ne change pas, on ne fait rien
        if (candidature.statut === statut) {
          return candidature;
        }

        // Logique de vérification si le nouveau statut est "Acceptée"
        if (statut === "Acceptée") {
          // Vérification si l'offre est disponible
          if (!candidature.Offre || !candidature.Offre.is_disponible) {
            throw new Error("offre_not_disponible");
          }

          // Trouver le nombre de places max pour ce profil dans cette offre
          const offreProfil = await OffreProfil.findOne({
            where: {
              OffreId: candidature.OffreId,
              ProfilId: candidature.ProfilId,
            },
            transaction: t,
          });
          if (!offreProfil) throw new Error("offre_profil_link_not_found");

          // Compter les candidatures déjà acceptées pour cevprofil
          const acceptedCount = await Candidature.count({
            where: {
              OffreId: candidature.OffreId,
              ProfilId: candidature.ProfilId,
              statut: "Acceptée",
            },
            transaction: t,
          });

          // Comparer
          if (acceptedCount >= offreProfil.nbProfil) {
            throw new Error("profil_plein");
          }
        }

        // Si la logique passe (ou si statut = Refusée/En attente), on met à jour
        const oldStatus = candidature.statut;

        candidature.statut = statut;
        await candidature.save({ transaction: t });

        // Logique de notification et d'envoi d'email
        const etudiant = await Etudiant.findByPk(candidature.EtudiantId, {
          transaction: t,
        });
        const utilisateur = etudiant
          ? await Utilisateur.findByPk(etudiant.UtilisateurId, {
              transaction: t,
            })
          : null;

        if (utilisateur) {
          // notification
          await notificationController.addNotification({
            UtilisateurId: utilisateur.id,
            message: `Le statut de votre candidature pour l'offre ${candidature.Offre.titre} a été mis à jour : ${statut}`,
            type: "simple",
            date_reception: new Date(),
          });
          // email
          await sendStudentStatusUpdate(
            utilisateur.email,
            candidature.Offre.titre,
            statut
          )
            .then(() => console.log("Email envoyé !"))
            .catch(console.error);
        }

        // Vérifie automatiquement fermeture ou réouverture
        if (
          statut === "Acceptée" ||
          (oldStatus === "Acceptée" && statut === "Refusée")
        ) {
          await checkAndCloseOffre(candidature.OffreId, t);
        }

        return candidature;
      });

      const message = `Le statut de la candidature a été mis à jour avec succès.`;
      return res.json({ message, data: updatedCandidature });
    } catch (error) {
      // Gestion des nouvelles erreurs
      if (error.message === "offre_not_disponible") {
        return res.status(403).json({
          message:
            "Impossible d'accepter la candidature : l'offre n'est plus disponible.",
        });
      }
      if (error.message === "profil_plein") {
        return res.status(409).json({
          message:
            "Ce profil est déjà complet pour cette offre. Impossible d'accepter la candidature.",
        });
      }
      // ...
      const message = `Le statut de la candidature n'a pas pu être mis à jour. Réessayez dans quelques instants.`;
      return res.status(500).json({ message, data: error.message || error });
    }
  }

  // Méthode pour supprimer une candidature
  static async deleteCandidature(req, res) {
    const id = parseInt(req.params.id);

    try {
      const deletedCandidature = await sequelize.transaction(async (t) => {
        const candidature = await Candidature.findByPk(id, { transaction: t });

        if (!candidature) throw new Error("not_found");

        // Helper pour tenter la suppression avec plusieurs types
        const robustDestroy = async (publicId, path) => {
          if (!publicId || !path) return;

          // On détermine le type le plus probable
          const primaryType = path.endsWith(".pdf") ? "raw" : "image";
          // L'autre type possible
          const fallbackType = primaryType === "raw" ? "image" : "raw";

          try {
            // 1. On tente avec le type le plus probable
            const result = await cloudinary.uploader.destroy(publicId, {
              resource_type: primaryType,
            });

            // Si "not found", on tente l'autre type
            if (result.result === "not found") {
              console.warn(
                `Type ${primaryType} non trouvé pour ${publicId}. Tentative avec ${fallbackType}...`
              );
              const fallbackResult = await cloudinary.uploader.destroy(
                publicId,
                {
                  resource_type: fallbackType,
                }
              );
              console.log(
                `Suppression (fallback type: ${fallbackType}) pour ${publicId}:`,
                fallbackResult
              );
            } else {
              console.log(
                `Suppression (type: ${primaryType}) pour ${publicId}:`,
                result
              );
            }
          } catch (error) {
            // Gérer les erreurs
            console.error(
              `Erreur lors de la suppression de ${publicId} de Cloudinary:`,
              error.message
            );
          }
        };

        // 1. Supprimer le CV sur Cloudinary
        await robustDestroy(candidature.cv_public_id, candidature.cv_path);

        // 2. Supprimer la LM sur Cloudinary
        await robustDestroy(candidature.lm_public_id, candidature.lm_path);

        // 3. Supprimer l'entrée dans la base de données
        await Candidature.destroy({ where: { id }, transaction: t });

        return candidature;
      });

      const message = `La candidature a été supprimée avec succès.`;
      return res.json({ message, data: deletedCandidature });
    } catch (error) {
      console.error(error);
      if (error.message === "not_found") {
        return res.status(404).json({ message: "Candidature introuvable." });
      }

      const message = `La candidature n'a pas pu être supprimée. Réessayez dans quelques instants.`;
      return res.status(500).json({ message, data: error });
    }
  }

  // Récupérer une candidature pour une offre spécifique
  static async getCandidatureCard(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).json({ message: "ID de l'offre manquant." });
      }

      const candidatures = await Candidature.findAll({
        where: { OffreId: id },
        include: [
          {
            model: Etudiant,
            attributes: ["id", "nom", "prenom", "ecole", "niveau"],
            include: [
              {
                model: Utilisateur,
                attributes: ["photo", "email"],
              },
            ],
          },
          {
            model: Profil,
            attributes: ["nomProfil"],
          },
        ],
      });

      const data = candidatures.map((c) => ({
        idCandidature: c.id,
        nom: `${c.Etudiant.nom} ${c.Etudiant.prenom}`,
        profilPostule: c.Profil ? c.Profil.nomProfil : "N/A",
        date_depot: c.date_candidature,
        photo: c.Etudiant?.Utilisateur?.photo || null,
        email: c.Etudiant?.Utilisateur?.email || null,
        ecole: c.Etudiant.ecole,
        niveau: c.Etudiant.niveau,
        statut: c.statut,
      }));

      const message = "Les candidatures ont été récupérées avec succès.";
      return res.json({ message, data });
    } catch (error) {
      console.error(error);
      const message =
        "Les candidatures n'ont pas pu être récupérées. Réessayez plus tard.";
      return res.status(500).json({ message, data: error.message });
    }
  }

  // récupérer une candidature spécifique
  static async getCandidatureById(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res
          .status(400)
          .json({ message: "ID de la candidature manquante." });
      }

      const candidature = await Candidature.findByPk(id, {
        include: [
          {
            model: Etudiant,
            attributes: ["id", "nom", "prenom"],
            include: [
              {
                model: Utilisateur,
                attributes: ["photo"],
              },
            ],
          },
          // Inclure le profil postulé
          {
            model: Profil,
            attributes: ["nomProfil"],
          },
        ],
      });

      if (!candidature) {
        return res.status(404).json({ message: "Candidature introuvable." });
      }

      const data = {
        idCandidature: candidature.id,
        nom: `${candidature.Etudiant.nom} ${candidature.Etudiant.prenom}`,
        profilPostule: candidature.Profil
          ? candidature.Profil.nomProfil
          : "N/A",
        statut: candidature.statut,
        photo: candidature.Etudiant?.Utilisateur?.photo || null,
        cv_public_id: candidature.cv_public_id,
        lm_public_id: candidature.lm_public_id,
      };

      const message = "La candidature a été récupérée avec succès.";
      return res.json({ message, data });
    } catch (error) {
      console.error(error);
      const message =
        "La candidature n'a pas pu être récupérée. Réessayez plus tard.";
      return res.status(500).json({ message, data: error.message });
    }
  }

  // Récupérer une candidature pour un étudiant spécifique
  static async getStudentCandidature(req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        return res
          .status(400)
          .json({ message: "ID de l'utilisateur manquant." });
      }

      const etudiant = await Etudiant.findOne({ where: { UtilisateurId: id } });

      if (!etudiant) {
        return res.status(404).json({ message: "Etudiant non trouvé." });
      }

      const candidatures = await Candidature.findAll({
        where: { EtudiantId: etudiant.id },
        include: [
          {
            model: Profil,
            attributes: ["nomProfil"],
          },
          {
            model: Offre,
            attributes: ["titre"],
          },
        ],
        order: [["date_candidature", "DESC"]],
      });

      const message = "Les candidatures ont été récupérées avec succès.";
      return res.json({ message, candidatures });
    } catch (error) {
      console.error("Erreur du contrôleur getStudentCandidature :", error);
      const message =
        "Les candidatures n'ont pas pu être récupérées. Réessayez plus tard.";
      return res.status(500).json({ message, data: error.message });
    }
  }
}

module.exports = CandidatureController;
