"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const messages = [
      // --- Discussion Étudiant 2
      {
        DiscussionId: 1,
        UtilisateurId: 2,
        contenu:
          "Bonjour, je viens de déposer ma candidature pour l'offre Laravel.",
        estLu: true,
        createdAt: new Date("2024-12-18T10:32:00"),
        updatedAt: now,
      },
      {
        DiscussionId: 1,
        UtilisateurId: 1, // admin
        contenu:
          "Bonjour, nous avons bien reçu votre candidature. Nous vous tiendrons informé.",
        estLu: true,
        createdAt: new Date("2024-12-18T10:35:00"),
        updatedAt: now,
      },

      // --- Discussion Étudiant 3
      {
        DiscussionId: 2,
        UtilisateurId: 3,
        contenu:
          "Bonjour, je voulais savoir si ma candidature ReactJS a été acceptée.",
        estLu: true,
        createdAt: new Date("2024-12-22T14:17:00"),
        updatedAt: now,
      },
      {
        DiscussionId: 2,
        UtilisateurId: 1, // admin
        contenu: "Oui, votre candidature a été acceptée. Félicitations !",
        estLu: true,
        createdAt: new Date("2024-12-22T14:20:00"),
        updatedAt: now,
      },

      // --- Discussion Étudiant 4
      {
        DiscussionId: 3,
        UtilisateurId: 4,
        contenu:
          "Bonjour, je n'ai pas reçu de retour sur ma candidature UI/UX.",
        estLu: true,
        createdAt: new Date("2024-12-28T09:50:00"),
        updatedAt: now,
      },
      {
        DiscussionId: 3,
        UtilisateurId: 1,
        contenu: "Bonjour, votre candidature a malheureusement été refusée.",
        estLu: true,
        createdAt: new Date("2024-12-28T10:00:00"),
        updatedAt: now,
      },

      // --- Discussion Étudiant 5
      {
        DiscussionId: 4,
        UtilisateurId: 5,
        contenu:
          "Bonjour, ma candidature Full Stack est-elle prise en compte ?",
        estLu: false,
        createdAt: new Date("2025-05-20T11:25:00"),
        updatedAt: now,
      },
      {
        DiscussionId: 4,
        UtilisateurId: 1,
        contenu:
          "Oui, votre candidature est bien enregistrée et en attente de validation.",
        estLu: false,
        createdAt: new Date("2025-05-20T11:30:00"),
        updatedAt: now,
      },

      // --- Discussion Étudiant 6
      {
        DiscussionId: 5,
        UtilisateurId: 6,
        contenu:
          "Bonjour, j'ai besoin de plus d'informations sur le stage Flutter.",
        estLu: false,
        createdAt: new Date("2025-05-25T16:05:00"),
        updatedAt: now,
      },
      {
        DiscussionId: 5,
        UtilisateurId: 1,
        contenu:
          "Bonjour, le stage commence en Juillet. Tous les détails sont sur l'offre.",
        estLu: false,
        createdAt: new Date("2025-05-25T16:10:00"),
        updatedAt: now,
      },

      // --- Discussion Étudiant 8
      {
        DiscussionId: 6,
        UtilisateurId: 8,
        contenu:
          "Bonjour, pouvez-vous me confirmer le statut de ma candidature Full Stack ?",
        estLu: false,
        createdAt: new Date("2025-05-22T12:15:00"),
        updatedAt: now,
      },
      {
        DiscussionId: 6,
        UtilisateurId: 1,
        contenu:
          "Bonjour, votre candidature est toujours en attente. Vous serez notifié dès qu'il y aura une mise à jour.",
        estLu: false,
        createdAt: new Date("2025-05-22T12:20:00"),
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("messages", messages, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("messages", null, {});
  },
};
