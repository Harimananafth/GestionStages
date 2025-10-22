'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('offres', [
      // 1: Offre Été - Full-Stack
      {
        titre: 'Développeur Full-Stack (Node/React)',
        is_disponible: true,
        PeriodeId: 1, // Été 2025
        date_publication: new Date(now.getTime() - 10 * 86400000), // Publiée il y a 10j
        updatedAt: now
      },
      // 2: Offre Été - Admin Réseau
      {
        titre: 'Stage Admin Sys & Réseau',
        is_disponible: true,
        PeriodeId: 1, // Été 2025
        date_publication: new Date(now.getTime() - 8 * 86400000), // Publiée il y a 8j
        updatedAt: now
      },
      // 3: Offre Hiver - Data
      {
        titre: 'Data Scientist Junior',
        is_disponible: true,
        PeriodeId: 2, // Hiver 2026
        date_publication: new Date(now.getTime() - 5 * 86400000), // Publiée il y a 5j
        updatedAt: now
      },
      // 4: Offre Hiver - Multi-profils
      {
        titre: 'Stage multi-profils tech Hiver 2026',
        is_disponible: true,
        PeriodeId: 2, // Hiver 2026
        date_publication: new Date(now.getTime() - 2 * 86400000), // Publiée il y a 2j
        updatedAt: now
      },
      // 5: Offre Ancienne (Indisponible)
      {
        titre: 'Stage de fin d\'études (anciens projets)',
        is_disponible: true, // Ancienne offre
        PeriodeId: 1, // Été 2025 (on fait semblant qu'elle est passée)
        date_publication: new Date(now.getTime() - 90 * 86400000), // Publiée il y a 90j
        updatedAt: new Date(now.getTime() - 30 * 86400000) // Modifiée il y a 30j
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('offres', null, {});
  }
};