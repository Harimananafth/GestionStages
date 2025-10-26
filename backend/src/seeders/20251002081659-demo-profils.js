"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const profils = [
      {
        nomProfil: "Développeur Laravel",
        descriptionProfil:
          "Conception et développement d’applications web en PHP avec le framework Laravel. Bonne maîtrise de MySQL et des APIs REST.",
        createdAt: now,
        updatedAt: now,
      },
      {
        nomProfil: "Développeur ReactJS",
        descriptionProfil:
          "Création d’interfaces web modernes et réactives avec ReactJS. Connaissances en intégration d’API et gestion d’état avec Redux ou Context API.",
        createdAt: now,
        updatedAt: now,
      },
      {
        nomProfil: "Développeur Full Stack",
        descriptionProfil:
          "Capable d’intervenir sur le front-end (Vue.js, React) et le back-end (Node.js, Laravel). Connaissance des bases de données SQL et Git.",
        createdAt: now,
        updatedAt: now,
      },
      {
        nomProfil: "Technicien Réseau",
        descriptionProfil:
          "Assure la maintenance, l’installation et la configuration des réseaux informatiques. Connaissances en câblage, routeurs et sécurité réseau.",
        createdAt: now,
        updatedAt: now,
      },
      {
        nomProfil: "Designer UI/UX",
        descriptionProfil:
          "Création de maquettes et interfaces ergonomiques avec Figma ou Adobe XD. Compréhension des besoins utilisateurs et des principes d’accessibilité.",
        createdAt: now,
        updatedAt: now,
      },
      {
        nomProfil: "Développeur Symfony",
        descriptionProfil:
          "Développement back-end robuste avec Symfony et Twig. Gestion des entités, sécurité et intégration avec PostgreSQL.",
        createdAt: now,
        updatedAt: now,
      },
      {
        nomProfil: "Data Analyst Junior",
        descriptionProfil:
          "Analyse de données et création de rapports à l’aide de Python, Excel et Power BI. Connaissance basique de SQL et des statistiques descriptives.",
        createdAt: now,
        updatedAt: now,
      },
      {
        nomProfil: "Développeur Mobile Flutter",
        descriptionProfil:
          "Développement d’applications mobiles cross-platform (Android/iOS) avec Flutter et Dart. Bonne compréhension du Material Design.",
        createdAt: now,
        updatedAt: now,
      },
      {
        nomProfil: "Intégrateur Web",
        descriptionProfil:
          "Intégration de maquettes HTML/CSS/JS responsives à partir de designs Figma. Bon sens du détail et respect des standards W3C.",
        createdAt: now,
        updatedAt: now,
      },
      {
        nomProfil: "Administrateur Base de Données",
        descriptionProfil:
          "Gestion et optimisation de bases de données MySQL/PostgreSQL. Sauvegardes, migrations et surveillance des performances.",
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("profils", profils, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("profils", null, {});
  },
};
