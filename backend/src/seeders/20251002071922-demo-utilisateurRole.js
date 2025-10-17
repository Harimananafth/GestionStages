'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('utilisateurRoles', [
      // Admin (UtilisateurId: 1, RoleId: 1)
      { id_utilisateur: 1, id_role: 1, createdAt: now, updatedAt: now },
      // Users (UtilisateurId: 2-7, RoleId: 2)
      { id_utilisateur: 2, id_role: 2, createdAt: now, updatedAt: now },
      { id_utilisateur: 3, id_role: 2, createdAt: now, updatedAt: now },
      { id_utilisateur: 4, id_role: 2, createdAt: now, updatedAt: now },
      { id_utilisateur: 5, id_role: 2, createdAt: now, updatedAt: now },
      { id_utilisateur: 6, id_role: 2, createdAt: now, updatedAt: now },
      { id_utilisateur: 7, id_role: 2, createdAt: now, updatedAt: now }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('utilisateurRoles', null, {});
  }
};