'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('offreProfils', [
      // Offre 1 (Full-Stack) : 2 places pour Profil 1 (Full-Stack)
      {
        OffreId: 1,
        ProfilId: 1,
        nbProfil: 2,
        createdAt: now,
        updatedAt: now
      },
      
      // Offre 2 (Admin Réseau) : 1 place pour Profil 2 (Admin Réseau)
      {
        OffreId: 2,
        ProfilId: 2,
        nbProfil: 1,
        createdAt: now,
        updatedAt: now
      },
      
      // Offre 3 (Data) : 2 places pour Profil 3 (Data Scientist)
      {
        OffreId: 3,
        ProfilId: 3,
        nbProfil: 2,
        createdAt: now,
        updatedAt: now
      },
      
      // Offre 4 (Multi)
      // 1 place pour Profil 1 (Full-Stack)
      {
        OffreId: 4,
        ProfilId: 1,
        nbProfil: 1,
        createdAt: now,
        updatedAt: now
      },
      // 2 places pour Profil 5 (Mobile)
      {
        OffreId: 4,
        ProfilId: 5,
        nbProfil: 2,
        createdAt: now,
        updatedAt: now
      },

      // Offre 5 (Ancienne)
      // 1 place pour Profil 4 (UX/UI)
      {
        OffreId: 5,
        ProfilId: 4,
        nbProfil: 1,
        createdAt: now,
        updatedAt: now
      },
      // 1 place pour Profil 6 (Chef Projet)
      {
        OffreId: 5,
        ProfilId: 6,
        nbProfil: 1,
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('offreProfils', null, {});
  }
};