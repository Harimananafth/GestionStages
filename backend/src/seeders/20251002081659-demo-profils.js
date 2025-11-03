'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('profils', [
      {
        nomProfil: 'Développeur Front-end',
        descriptionProfil: 'Maîtrise de HTML, CSS, JavaScript et frameworks comme React ou Angular',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nomProfil: 'Développeur Back-end',
        descriptionProfil: 'Expérience avec Node.js, Express, bases de données SQL et NoSQL',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nomProfil: 'Data Scientist',
        descriptionProfil: 'Analyse de données, machine learning et visualisation avec Python ou R',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nomProfil: 'Administrateur Réseaux',
        descriptionProfil: 'Gestion des réseaux, sécurité et serveurs',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('profils', null, {});
  }
};
