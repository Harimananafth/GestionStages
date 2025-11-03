'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('periodes', [
      // 1: Été 2025
      {
        date_debut: '2025-06-01T00:00:00.000Z',
        date_fin: '2025-08-31T23:59:59.000Z',
        createdAt: now,
        updatedAt: now
      },
      // 2: Hiver 2026
      {
        date_debut: '2026-01-05T00:00:00.000Z',
        date_fin: '2026-03-27T23:59:59.000Z',
        createdAt: now,
        updatedAt: now
      },
      // 3: Printemps 2026
      {
        date_debut: '2026-04-01T00:00:00.000Z',
        date_fin: '2026-06-30T23:59:59.000Z',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('periodes', null, {});
  }
};