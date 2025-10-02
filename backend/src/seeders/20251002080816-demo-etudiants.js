'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('etudiants', [
      {
        id_utilisateur: 2, // correspond à user@example.com
        nom: 'Rabeharison',
        prenom: 'Fitahiana',
        telephone: '0341234567',
        adresse: 'Antananarivo, Madagascar',
        ecole: 'Université d\'Antananarivo',
        niveau: 'L2',
        specialite: 'Informatique',
        diplome: 'Bac S',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_utilisateur: 3, // correspond à moderator@example.com
        nom: 'Rakoto',
        prenom: 'Miora',
        telephone: '0339876543',
        adresse: 'Antsirabe, Madagascar',
        ecole: 'Université Polytechnique',
        niveau: 'L3',
        specialite: 'Génie Logiciel',
        diplome: 'Bac STI',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('etudiants', null, {});
  }
};
