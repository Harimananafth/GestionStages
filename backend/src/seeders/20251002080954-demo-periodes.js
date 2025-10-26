"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const periodes = [
      {
        date_debut: new Date("2025-01-06"),
        date_fin: new Date("2025-06-27"),
        createdAt: now,
        updatedAt: now,
      },
      {
        date_debut: new Date("2025-07-07"),
        date_fin: new Date("2025-11-21"),
        createdAt: now,
        updatedAt: now,
      },
      {
        date_debut: new Date("2024-01-08"),
        date_fin: new Date("2024-06-21"),
        createdAt: now,
        updatedAt: now,
      },
      {
        date_debut: new Date("2024-07-08"),
        date_fin: new Date("2024-11-22"),
        createdAt: now,
        updatedAt: now,
      },
      {
        date_debut: new Date("2023-01-09"),
        date_fin: new Date("2023-06-23"),
        createdAt: now,
        updatedAt: now,
      },
      {
        date_debut: new Date("2023-07-10"),
        date_fin: new Date("2023-11-24"),
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("periodes", periodes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("periodes", null, {});
  },
};
