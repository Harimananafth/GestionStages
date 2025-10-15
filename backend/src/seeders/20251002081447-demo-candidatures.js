'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('candidatures', [
      {
        EtudiantId: 1, // correspond à Rabeharison Fitahiana
        OffreId: 1,    // correspond à 'Stage Développement Web'
        cv_path: 'uploads/cv_rabeharison.pdf',
        lm_path: 'uploads/lm_rabeharison.pdf',
        statut: 'En attente',
        date_candidature: new Date('2025-01-15'),
        updatedAt: new Date()
      },      
      {
        EtudiantId: 1, // correspond à Rabeharison Fitahiana
        OffreId: 2,    // correspond à 'Stage Développement Web'
        cv_path: 'uploads/cv_rabeharison.pdf',
        lm_path: 'uploads/lm_rabeharison.pdf',
        statut: 'En attente',
        date_candidature: new Date('2025-01-15'),
        updatedAt: new Date()
      },
      {
        EtudiantId: 2, // correspond à Rakoto Miora
        OffreId: 2,    // correspond à 'Stage Data Science'
        cv_path: 'uploads/cv_rakoto.pdf',
        lm_path: 'uploads/lm_rakoto.pdf',
        statut: 'Acceptée',
        date_candidature: new Date('2025-02-20'),
        updatedAt: new Date()
      },
      {
        EtudiantId: 1,
        OffreId: 3,    // correspond à 'Stage Réseaux et Télécom'
        cv_path: 'uploads/cv_rabeharison.pdf',
        lm_path: 'uploads/lm_rabeharison.pdf',
        statut: 'Refusée',
        date_candidature: new Date('2025-07-10'),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('candidatures', null, {});
  }
};
