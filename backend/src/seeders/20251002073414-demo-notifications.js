'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();

    const notifications = [
      // --- Notifications 'Actualité' (Globales, UtilisateurId: null) ---
      {
        UtilisateurId: null,
        message: "Une nouvelle offre de stage a été publiée : Développeur Full-Stack (Node/React). N'hésitez pas à postuler si elle convient à votre profil !",
        type: 'actualité',
        lu: false,
        createdAt: new Date(now.getTime() - 10 * 86400000), // Date publication offre
        updatedAt: now
      },
      {
        UtilisateurId: null,
        message: "Une nouvelle offre de stage a été publiée : Stage Admin Sys & Réseau. N'hésitez pas à postuler si elle convient à votre profil !",
        type: 'actualité',
        lu: false,
        createdAt: new Date(now.getTime() - 8 * 86400000),
        updatedAt: now
      },
      {
        UtilisateurId: null,
        message: "Une nouvelle offre de stage a été publiée : Data Scientist Junior. N'hésitez pas à postuler si elle convient à votre profil !",
        type: 'actualité',
        lu: false,
        createdAt: new Date(now.getTime() - 5 * 86400000),
        updatedAt: now
      },
      {
        UtilisateurId: null,
        message: "Une nouvelle offre de stage a été publiée : Stage multi-profils tech Hiver 2026. N'hésitez pas à postuler si elle convient à votre profil !",
        type: 'actualité',
        lu: false,
        createdAt: new Date(now.getTime() - 2 * 86400000),
        updatedAt: now
      },
      
      // --- Notifications 'Simple' pour Admin (Dépôt candidature, UtilisateurId: null) ---
      {
        UtilisateurId: null,
        message: "Une candidature a été postée pour l'offre Développeur Full-Stack (Node/React)",
        type: 'simple',
        lu: false, // L'admin ne l'a pas encore lue
        createdAt: new Date(now.getTime() - 8 * 86400000), // cand1_offre1
        updatedAt: now
      },
      {
        UtilisateurId: null,
        message: "Une candidature a été postée pour l'offre Développeur Full-Stack (Node/React)",
        type: 'simple',
        lu: true, // L'admin l'a lue
        createdAt: new Date(now.getTime() - 7 * 86400000), // cand2_offre1
        updatedAt: now
      },
      {
        UtilisateurId: null,
        message: "Une candidature a été postée pour l'offre Stage Admin Sys & Réseau",
        type: 'simple',
        lu: true,
        createdAt: new Date(now.getTime() - 7 * 86400000), // cand1_offre2
        updatedAt: now
      },
      {
        UtilisateurId: null,
        message: "Une candidature a été postée pour l'offre Développeur Full-Stack (Node/React)",
        type: 'simple',
        lu: true,
        createdAt: new Date(now.getTime() - 6 * 86400000), // cand3_offre1
        updatedAt: now
      },
      {
        UtilisateurId: null,
        message: "Une candidature a été postée pour l'offre Data Scientist Junior",
        type: 'simple',
        lu: false,
        createdAt: new Date(now.getTime() - 4 * 86400000), // cand1_offre3
        updatedAt: now
      },
      {
        UtilisateurId: null,
        message: "Une candidature a été postée pour l'offre Stage Admin Sys & Réseau",
        type: 'simple',
        lu: false,
        createdAt: new Date(now.getTime() - 3 * 86400000), // cand2_offre2
        updatedAt: now
      },
      {
        UtilisateurId: null,
        message: "Une candidature a été postée pour l'offre Stage multi-profils tech Hiver 2026",
        type: 'simple',
        lu: false,
        createdAt: new Date(now.getTime() - 1 * 86400000), // cand1_offre4
        updatedAt: now
      },

      // --- Notifications 'Simple' pour Étudiants (Statut, UtilisateurId: [id]) ---
      {
        UtilisateurId: 2, // Alice (Etudiant 1)
        message: "Le statut de votre candidature pour l'offre Développeur Full-Stack (Node/React) a été mis à jour : Acceptée",
        type: 'simple',
        lu: false,
        createdAt: new Date(now.getTime() - 2 * 86400000), // cand1_offre1
        updatedAt: now
      },
      {
        UtilisateurId: 5, // David (Etudiant 4)
        message: "Le statut de votre candidature pour l'offre Développeur Full-Stack (Node/React) a été mis à jour : Acceptée",
        type: 'simple',
        lu: true, // L'étudiant l'a lue
        createdAt: new Date(now.getTime() - 1 * 86400000), // cand2_offre1
        updatedAt: now
      },
      {
        UtilisateurId: 4, // Claire (Etudiant 3)
        message: "Le statut de votre candidature pour l'offre Développeur Full-Stack (Node/React) a été mis à jour : Refusée",
        type: 'simple',
        lu: false,
        createdAt: new Date(now.getTime() - 3 * 86400000), // cand3_offre1
        updatedAt: now
      },
      {
        UtilisateurId: 3, // Bob (Etudiant 2)
        message: "Le statut de votre candidature pour l'offre Stage Admin Sys & Réseau a été mis à jour : Acceptée",
        type: 'simple',
        lu: false,
        createdAt: new Date(now.getTime() - 4 * 86400000), // cand1_offre2
        updatedAt: now
      }
    ];

    await queryInterface.bulkInsert('notifications', notifications, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', null, {});
  }
};