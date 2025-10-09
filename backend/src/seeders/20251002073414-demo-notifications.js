'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('notifications', [
      {
        UtilisateurId: null, // correspond à admin@example.com
        message: 'Bienvenue sur la plateforme !',
        type: 'simple',
        lu: false,
        date_reception: new Date(),
        updatedAt: new Date()
      },
      {
        UtilisateurId: null, // correspond à user@example.com
        message: 'Une nouvelle offre de stage est disponible. Consultez la section offres pour plus de détails',
        type: 'actualité',
        lu: false,
        date_reception: new Date(),
        updatedAt: new Date()
      },
      {
        UtilisateurId: null,
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
