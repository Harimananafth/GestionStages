'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('profils', [
      // 1
      {
        nomProfil: 'Développeur Full-Stack',
        descriptionProfil: 'Maîtrise de Node.js, React, et des bases de données SQL/NoSQL.',
        createdAt: now,
        updatedAt: now
      },
      // 2
      {
        nomProfil: 'Administrateur Réseau',
        descriptionProfil: 'Compétences en gestion de réseaux, sécurité, et maintenance de serveurs Linux/Windows.',
        createdAt: now,
        updatedAt: now
      },
      // 3
      {
        nomProfil: 'Data Scientist',
        descriptionProfil: 'Expertise en Python (Pandas, Scikit-learn), SQL et visualisation de données.',
        createdAt: now,
        updatedAt: now
      },
      // 4
      {
        nomProfil: 'Designer UX/UI',
        descriptionProfil: 'Maîtrise de Figma, Adobe XD. Portfolio requis.',
        createdAt: now,
        updatedAt: now
      },
      // 5
      {
        nomProfil: 'Développeur Mobile (React Native)',
        descriptionProfil: 'Expérience en développement d\'applications mobiles hybrides.',
        createdAt: now,
        updatedAt: now
      },
      // 6
      {
        nomProfil: 'Chef de Projet Digital',
        descriptionProfil: 'Connaissance des méthodologies Agiles (Scrum, Kanban) et outils de gestion (Jira).',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('profils', null, {});
  }
};