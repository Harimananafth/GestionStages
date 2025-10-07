'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedAdmin = await bcrypt.hash('admin123', 10);
    const hashedUser = await bcrypt.hash('user123', 10);
    const hashedMod = await bcrypt.hash('mod123', 10);

    return queryInterface.bulkInsert('utilisateurs', [
      {
        googleId: null,
        email: 'admin@example.com',
        name: 'Admin Principal',
        password: hashedAdmin,
        photo: '/images/default-img-profil.png',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        googleId: null,
        email: 'user@example.com',
        name: 'Utilisateur Test',
        password: hashedUser,
        photo: '/images/default-img-profil.png',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        googleId: null,
        email: 'moderator@example.com',
        name: 'Modérateur Exemple',
        password: hashedMod,
        photo: '/images/default-img-profil.png',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('utilisateurs', {
      email: ['admin@example.com', 'user@example.com', 'moderator@example.com']
    }, {});
  }
};
