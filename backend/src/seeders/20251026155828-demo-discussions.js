"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const discussions = [
      // Étudiant 2 → discussion ouverte avec admin
      {
        UtilisateurId: 2,
        statut: "ouvert",
        dernierMessageAt: new Date("2024-12-18T10:30:00"),
        createdAt: now,
        updatedAt: now,
      },
      // Étudiant 3 → discussion fermée
      {
        UtilisateurId: 3,
        statut: "fermé",
        dernierMessageAt: new Date("2024-12-22T14:15:00"),
        createdAt: now,
        updatedAt: now,
      },
      // Étudiant 4 → discussion ouverte
      {
        UtilisateurId: 4,
        statut: "ouvert",
        dernierMessageAt: new Date("2024-12-28T09:45:00"),
        createdAt: now,
        updatedAt: now,
      },
      // Étudiant 5 → discussion ouverte
      {
        UtilisateurId: 5,
        statut: "ouvert",
        dernierMessageAt: new Date("2025-05-20T11:20:00"),
        createdAt: now,
        updatedAt: now,
      },
      // Étudiant 6 → discussion fermée
      {
        UtilisateurId: 6,
        statut: "fermé",
        dernierMessageAt: new Date("2025-05-25T16:00:00"),
        createdAt: now,
        updatedAt: now,
      },
      // Étudiant 8 → discussion ouverte
      {
        UtilisateurId: 8,
        statut: "ouvert",
        dernierMessageAt: new Date("2025-05-22T12:10:00"),
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("discussions", discussions, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("discussions", null, {});
  },
};
