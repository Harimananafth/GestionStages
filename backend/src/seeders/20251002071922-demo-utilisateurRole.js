'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Associer les utilisateurs aux rôles
    return queryInterface.bulkInsert('utilisateurRoles', [
      {
        id_utilisateur: 1, // correspond à admin@example.com
        id_role: 1,        // correspond à 'admin'
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_utilisateur: 2, // correspond à user@example.com
        id_role: 2,        // correspond à 'étudiant'
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_utilisateur: 3, // correspond à moderator@example.com (si tu l'as)
        id_role: 2,        // par exemple admin ou autre rôle
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('utilisateurRoles', null, {});
  }
};
