'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    const saltRounds = 10;
    
    // Mots de passe
    const adminPassword = await bcrypt.hash('adminpassword', saltRounds);
    const userPassword1 = await bcrypt.hash('password123', saltRounds);
    const userPassword2 = await bcrypt.hash('password456', saltRounds);
    const userPassword3 = await bcrypt.hash('password789', saltRounds);
    const userPassword4 = await bcrypt.hash('password101', saltRounds);
    const userPassword5 = await bcrypt.hash('password112', saltRounds);
    const userPassword6 = await bcrypt.hash('password131', saltRounds);

    await queryInterface.bulkInsert('utilisateurs', [
      // 1: Admin
      {
        email: 'admin@stage.com',
        name: 'Admin Principal',
        password: adminPassword,
        photo: 'https://i.pravatar.cc/150?img=68',
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      // 2: Etudiant 1 (Alice)
      {
        email: 'alice.dupont@edu.com',
        name: 'Alice Dupont',
        password: userPassword1,
        photo: 'https://i.pravatar.cc/150?img=1',
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      // 3: Etudiant 2 (Bob)
      {
        email: 'bob.martin@edu.com',
        name: 'Bob Martin',
        password: userPassword2,
        photo: 'https://i.pravatar.cc/150?img=7',
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      // 4: Etudiant 3 (Claire)
      {
        email: 'claire.durand@edu.com',
        name: 'Claire Durand',
        password: userPassword3,
        photo: 'https://i.pravatar.cc/150?img=5',
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      // 5: Etudiant 4 (David)
      {
        email: 'david.petit@edu.com',
        name: 'David Petit',
        password: userPassword4,
        photo: 'https://i.pravatar.cc/150?img=12',
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      // 6: Etudiant 5 (Eva)
      {
        email: 'eva.roy@edu.com',
        name: 'Eva Roy',
        password: userPassword5,
        photo: 'https://i.pravatar.cc/150?img=32',
        isVerified: true,
        createdAt: now,
        updatedAt: now
      },
      // 7: Etudiant 6 (Fabien)
      {
        email: 'fabien.moreau@edu.com',
        name: 'Fabien Moreau',
        password: userPassword6,
        photo: 'https://i.pravatar.cc/150?img=14',
        isVerified: true,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('utilisateurs', null, {});
  }
};