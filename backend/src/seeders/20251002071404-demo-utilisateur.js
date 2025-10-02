'use strict';
const bcrypt = require('bcrypt'); // si tu veux hasher les mots de passe

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('utilisateurs', [
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'moderator@example.com',
        password: await bcrypt.hash('mod123', 10),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('utilisateurs', null, {});
  }
};
