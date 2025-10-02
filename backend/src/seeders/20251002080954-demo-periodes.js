'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('periodes', [
      {
        date_debut: new Date('2025-01-01'),
        date_fin: new Date('2025-06-30'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        date_debut: new Date('2025-07-01'),
        date_fin: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        date_debut: new Date('2026-01-01'),
        date_fin: new Date('2026-06-30'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('periodes', null, {});
  }
};

