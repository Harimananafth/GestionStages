"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const offreProfils = [
      // --- Offre 1 : Stage Développeur Laravel
      { OffreId: 1, ProfilId: 1, nbProfil: 2, createdAt: now, updatedAt: now },
      { OffreId: 1, ProfilId: 3, nbProfil: 1, createdAt: now, updatedAt: now },

      // --- Offre 2 : Stage Front-end ReactJS
      { OffreId: 2, ProfilId: 2, nbProfil: 2, createdAt: now, updatedAt: now },
      { OffreId: 2, ProfilId: 3, nbProfil: 1, createdAt: now, updatedAt: now },

      // --- Offre 3 : Stage Designer UI/UX
      { OffreId: 3, ProfilId: 5, nbProfil: 1, createdAt: now, updatedAt: now },

      // --- Offre 4 : Stage Data Analyst
      { OffreId: 4, ProfilId: 7, nbProfil: 1, createdAt: now, updatedAt: now },

      // --- Offre 5 : Stage Full Stack
      { OffreId: 5, ProfilId: 1, nbProfil: 1, createdAt: now, updatedAt: now },
      { OffreId: 5, ProfilId: 2, nbProfil: 1, createdAt: now, updatedAt: now },
      { OffreId: 5, ProfilId: 3, nbProfil: 1, createdAt: now, updatedAt: now },

      // --- Offre 6 : Stage Flutter
      { OffreId: 6, ProfilId: 8, nbProfil: 2, createdAt: now, updatedAt: now },

      // --- Offre 7 : Stage Intégrateur Web
      { OffreId: 7, ProfilId: 9, nbProfil: 2, createdAt: now, updatedAt: now },

      // --- Offre 8 : Stage Technicien Réseau
      { OffreId: 8, ProfilId: 4, nbProfil: 1, createdAt: now, updatedAt: now },

      // --- Offre 9 : Stage Symfony
      { OffreId: 9, ProfilId: 6, nbProfil: 1, createdAt: now, updatedAt: now },

      // --- Offre 10 : Stage Admin Base de Données
      {
        OffreId: 10,
        ProfilId: 10,
        nbProfil: 1,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("offreProfils", offreProfils, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("offreProfils", null, {});
  },
};
