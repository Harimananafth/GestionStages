'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('offreProfils', [
      {
        id_offre: 1, // 'Stage Développement Web'
        id_profil: 1, // 'Développeur Front-end'
        nbProfil: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_offre: 2, // 'Stage Data Science'
        id_profil: 3, // 'Data Scientist'
        nbProfil: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_offre: 3, // 'Stage Réseaux et Télécom'
        id_profil: 4, // 'Administrateur Réseaux'
        nbProfil: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('offreProfils', null, {});
  }
};
