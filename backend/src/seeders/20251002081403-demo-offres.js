'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('offres', [
      {
        id_periode: 1, // correspond à la première période
        titre: 'Stage Développement Web',
        date_publication: new Date('2025-01-10'),
        updatedAt: new Date()
      },
      {
        id_periode: 1,
        titre: 'Stage Data Science',
        date_publication: new Date('2025-02-15'),
        updatedAt: new Date()
      },
      {
        id_periode: 2, // correspond à la deuxième période
        titre: 'Stage Réseaux et Télécom',
        date_publication: new Date('2025-07-05'),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('offres', null, {});
  }
};
