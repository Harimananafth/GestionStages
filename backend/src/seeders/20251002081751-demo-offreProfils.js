'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('offreProfils', [
      {
        OffreId: 1, // 'Stage Développement Web'
        ProfilId: 1, // 'Développeur Front-end'
        nbProfil: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        OffreId: 1, // 'Stage Développement Web'
        ProfilId: 3, // 'Développeur Front-end'
        nbProfil: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        OffreId: 2, // 'Stage Data Science'
        ProfilId: 3, // 'Data Scientist'
        nbProfil: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        OffreId: 3, // 'Stage Réseaux et Télécom'
        ProfilId: 4, // 'Administrateur Réseaux'
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
