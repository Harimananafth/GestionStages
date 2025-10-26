"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const offres = [
      {
        PeriodeId: 1, // Janvier - Juin 2025
        titre:
          "Stage Développeur Laravel – Création d’un système de gestion RH",
        is_disponible: true,
        date_publication: new Date("2024-12-15"),
        updatedAt: now,
      },
      {
        PeriodeId: 1,
        titre: "Stage Front-end ReactJS – Application de suivi de projets",
        is_disponible: true,
        date_publication: new Date("2024-12-20"),
        updatedAt: now,
      },
      {
        PeriodeId: 1,
        titre: "Stage Designer UI/UX – Maquettage d’une plateforme e-learning",
        is_disponible: true,
        date_publication: new Date("2024-12-28"),
        updatedAt: now,
      },
      {
        PeriodeId: 1,
        titre: "Stage Data Analyst – Analyse de données de trafic web",
        is_disponible: true,
        date_publication: new Date("2025-01-05"),
        updatedAt: now,
      },
      {
        PeriodeId: 2, // Juillet - Novembre 2025
        titre:
          "Stage Full Stack – Développement d’un portail intranet en Vue.js et Laravel",
        is_disponible: true,
        date_publication: new Date("2025-05-10"),
        updatedAt: now,
      },
      {
        PeriodeId: 2,
        titre: "Stage Flutter – Application mobile de commande en ligne",
        is_disponible: true,
        date_publication: new Date("2025-05-15"),
        updatedAt: now,
      },
      {
        PeriodeId: 2,
        titre:
          "Stage Intégrateur Web – Intégration de templates pour sites vitrines",
        is_disponible: true,
        date_publication: new Date("2025-06-01"),
        updatedAt: now,
      },
      {
        PeriodeId: 2,
        titre:
          "Stage Technicien Réseau – Installation et maintenance d’un LAN d’entreprise",
        is_disponible: true,
        date_publication: new Date("2025-06-10"),
        updatedAt: now,
      },
      {
        PeriodeId: 3, // Janvier - Juin 2024
        titre: "Stage Symfony – API REST pour gestion de stock",
        is_disponible: true,
        date_publication: new Date("2023-12-18"),
        updatedAt: now,
      },
      {
        PeriodeId: 4, // Juillet - Novembre 2024
        titre: "Stage Admin Base de Données – Optimisation PostgreSQL",
        is_disponible: true,
        date_publication: new Date("2024-06-05"),
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("offres", offres, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("offres", null, {});
  },
};
