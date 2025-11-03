'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('notifications', [
      {
        UtilisateurId: 1, // correspond à admin@example.com
        message: 'Bienvenue sur la plateforme !',
        type: 'simple',
        lu: false,
        date_reception: new Date(),
        updatedAt: new Date()
      },
      {
        UtilisateurId: 2, // correspond à user@example.com
        message: 'Une nouvelle offre de stage est disponible.',
        type: 'actualité',
        lu: false,
        date_reception: new Date(),
        updatedAt: new Date()
      },
      {
        UtilisateurId: 1,
        message: 'Votre profil a été mis à jour.',
        type: 'simple',
        lu: true,
        date_reception: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('notifications', null, {});
  }
};
