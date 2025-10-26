"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const utilisateurRoles = [
      // Admin
      { id_role: 1, id_utilisateur: 1, createdAt: now, updatedAt: now },
      // Users
      { id_role: 2, id_utilisateur: 2, createdAt: now, updatedAt: now },
      { id_role: 2, id_utilisateur: 3, createdAt: now, updatedAt: now },
      { id_role: 2, id_utilisateur: 4, createdAt: now, updatedAt: now },
      { id_role: 2, id_utilisateur: 5, createdAt: now, updatedAt: now },
      { id_role: 2, id_utilisateur: 6, createdAt: now, updatedAt: now },
      { id_role: 2, id_utilisateur: 7, createdAt: now, updatedAt: now },
      { id_role: 2, id_utilisateur: 8, createdAt: now, updatedAt: now },
      { id_role: 2, id_utilisateur: 9, createdAt: now, updatedAt: now },
      { id_role: 2, id_utilisateur: 10, createdAt: now, updatedAt: now },
      { id_role: 2, id_utilisateur: 11, createdAt: now, updatedAt: now },
    ];

    await queryInterface.bulkInsert("utilisateurRoles", utilisateurRoles, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("utilisateurRoles", null, {});
  },
};
