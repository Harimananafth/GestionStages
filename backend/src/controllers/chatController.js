const {
  Discussion,
  Message,
  Utilisateur,
  Etudiant,
  sequelize,
} = require("../models"); 
const { Op } = require("sequelize");

const chatController = {
  // [Pour les Admins] Récupère TOUTES les discussions
  getAllDiscussions: async (req, res) => {
    try {
      const discussions = await Discussion.findAll({
        // Inclure l'étudiant associé à la discussion
        include: [
          {
            model: Utilisateur,
            as: "etudiant",
            attributes: ["id", "email", "photo"],
            include: {
              model: Etudiant,
              attributes: ["nom", "prenom"],
            },
          },
          {
            model: Message,
            as: "messages",
            limit: 1,
            order: [["createdAt", "DESC"]],
            attributes: ["contenu", "createdAt", "estLu", "UtilisateurId"],
          },
        ],
        order: [["dernierMessageAt", "DESC"]], 
      });

      // Formater les données
      const formattedDiscussions = discussions.map((d) => {
        const etudiant = d.etudiant.Etudiants[0]; 
        const dernierMessage = d.messages[0] || null;
        return {
          id: d.id,
          statut: d.statut,
          dernierMessageAt: d.dernierMessageAt,
          etudiant: {
            id: d.etudiant.id,
            email: d.etudiant.email,
            photo: d.etudiant.photo,
            nom: etudiant
              ? `${etudiant.nom} ${etudiant.prenom}`
              : d.etudiant.email,
          },
          dernierMessage: dernierMessage,
        };
      });

      res.status(200).json({ data: formattedDiscussions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  },

  // [Pour les Étudiants] Récupère LEUR discussion
  getMyDiscussion: async (req, res) => {
    const etudiantId = req.user.id;
    try {
      // Trouve ou crée la discussion pour cet étudiant
      const [discussion] = await Discussion.findOrCreate({
        where: { UtilisateurId: etudiantId },
        defaults: { UtilisateurId: etudiantId },
      });

      res.status(200).json({ data: discussion });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  },

  // [Pour tous] Récupère les messages d'une discussion
  getMessagesForDiscussion: async (req, res) => {
    const { discussionId } = req.params;
    const userId = req.user.id;
    const userRoles = req.user.roles;

    try {
      const discussion = await Discussion.findByPk(discussionId);
      if (!discussion) {
        return res.status(404).json({ message: "Discussion non trouvée." });
      }

      // Sécurité : Vérifie que l'étudiant ne voit que sa propre discussion
      if (!userRoles.includes("admin") && discussion.UtilisateurId !== userId) {
        return res.status(403).json({ message: "Accès non autorisé." });
      }

      // Récupère tous les messages
      const messages = await Message.findAll({
        where: { DiscussionId: discussionId },
        include: [
          {
            model: Utilisateur,
            as: "envoyeur",
            attributes: ["id", "photo"], 
          },
        ],
        order: [["createdAt", "ASC"]],
      });

      // Mettre les messages de l'étudiant comme "lus" (puisqu'un admin les regarde)
      if (userRoles.includes("admin")) {
        await Message.update(
          { estLu: true },
          {
            where: {
              DiscussionId: discussionId,
              UtilisateurId: { [Op.ne]: userId },
            },
          }
        );
      }
      // Mettre les messages de l'admin comme "lus" (puisqu'un étudiant les regarde)
      if (!userRoles.includes("admin")) {
        await Message.update(
          { estLu: true },
          {
            where: {
              DiscussionId: discussionId,
              UtilisateurId: { [Op.ne]: userId },
            },
          }
        );
      }

      res.status(200).json({ data: messages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  },
};

module.exports = chatController;
