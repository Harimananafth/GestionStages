"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const notifications = [
      // --- Notifications admin (UtilisateurId = null)
      {
        UtilisateurId: null,
        message:
          "Nouvelle candidature déposée pour l'offre Développeur Laravel. Vérifiez les détails dans le tableau de bord.",
        type: "simple",
        lu: false,
        date_reception: new Date("2024-12-18"),
        updatedAt: now,
      },
      {
        UtilisateurId: null,
        message:
          "Nouvelle offre Développeur ReactJS publiée. La période Janvier à Juin 2025 est ouverte aux candidatures.",
        type: "actualité",
        lu: false,
        date_reception: new Date("2024-12-20"),
        updatedAt: now,
      },
      {
        UtilisateurId: null,
        message:
          "Nouvelle période de stage Juillet à Novembre 2025 publiée. Les offres associées sont disponibles pour consultation.",
        type: "actualité",
        lu: false,
        date_reception: new Date("2025-05-01"),
        updatedAt: now,
      },

      // --- Notifications utilisateur (confirmation dépôt candidature)
      {
        UtilisateurId: 2,
        message:
          "Votre candidature pour l'offre Développeur Laravel a bien été déposée.",
        type: "simple",
        lu: false,
        date_reception: new Date("2024-12-18"),
        updatedAt: now,
      },
      {
        UtilisateurId: 3,
        message:
          "Votre candidature pour l'offre Front-end ReactJS a été acceptée.",
        type: "simple",
        lu: false,
        date_reception: new Date("2024-12-22"),
        updatedAt: now,
      },
      {
        UtilisateurId: 4,
        message: "Votre candidature pour l'offre Designer UI/UX a été refusée.",
        type: "simple",
        lu: false,
        date_reception: new Date("2024-12-28"),
        updatedAt: now,
      },
      {
        UtilisateurId: 5,
        message: "Votre candidature pour l'offre Full Stack est en attente.",
        type: "simple",
        lu: false,
        date_reception: new Date("2025-05-20"),
        updatedAt: now,
      },
      {
        UtilisateurId: 6,
        message: "Votre candidature pour l'offre Flutter a bien été déposée.",
        type: "simple",
        lu: false,
        date_reception: new Date("2025-05-25"),
        updatedAt: now,
      },
      {
        UtilisateurId: 8,
        message:
          "Le statut de votre candidature pour l'offre Full Stack a été modifié. Consultez votre tableau de bord pour les détails.",
        type: "simple",
        lu: false,
        date_reception: new Date("2025-05-22"),
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("notifications", notifications, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notifications", null, {});
  },
};
