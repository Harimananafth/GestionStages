"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const candidatures = [
      // Étudiant 2 postule pour Offre 1 (Laravel) avec Profil 1
      {
        EtudiantId: 2,
        OffreId: 1,
        ProfilId: 1,
        cv_path: "https://res.cloudinary.com/demo/raw/upload/cv_fitahiana.pdf",
        cv_public_id: "cv_fitahiana",
        lm_path: "https://res.cloudinary.com/demo/raw/upload/lm_fitahiana.pdf",
        lm_public_id: "lm_fitahiana",
        statut: "En attente",
        date_candidature: new Date("2024-12-18"),
        updatedAt: now,
      },
      // Étudiant 3 postule pour Offre 2 (ReactJS) avec Profil 2
      {
        EtudiantId: 3,
        OffreId: 2,
        ProfilId: 2,
        cv_path: "https://res.cloudinary.com/demo/raw/upload/cv_tahina.pdf",
        cv_public_id: "cv_tahina",
        lm_path: "https://res.cloudinary.com/demo/raw/upload/lm_tahina.pdf",
        lm_public_id: "lm_tahina",
        statut: "Acceptée",
        date_candidature: new Date("2024-12-22"),
        updatedAt: now,
      },
      // Étudiant 4 postule pour Offre 3 (UI/UX) avec Profil 5
      {
        EtudiantId: 4,
        OffreId: 3,
        ProfilId: 5,
        cv_path: "https://res.cloudinary.com/demo/raw/upload/cv_miora.pdf",
        cv_public_id: "cv_miora",
        lm_path: "https://res.cloudinary.com/demo/raw/upload/lm_miora.pdf",
        lm_public_id: "lm_miora",
        statut: "Refusée",
        date_candidature: new Date("2024-12-28"),
        updatedAt: now,
      },
      // Étudiant 5 postule pour Offre 5 (Full Stack) avec Profil 3
      {
        EtudiantId: 5,
        OffreId: 5,
        ProfilId: 3,
        cv_path: "https://res.cloudinary.com/demo/raw/upload/cv_herizo.pdf",
        cv_public_id: "cv_herizo",
        lm_path: "https://res.cloudinary.com/demo/raw/upload/lm_herizo.pdf",
        lm_public_id: "lm_herizo",
        statut: "En attente",
        date_candidature: new Date("2025-05-20"),
        updatedAt: now,
      },
      // Étudiant 6 postule pour Offre 6 (Flutter) avec Profil 8
      {
        EtudiantId: 6,
        OffreId: 6,
        ProfilId: 8,
        cv_path: "https://res.cloudinary.com/demo/raw/upload/cv_tiana.pdf",
        cv_public_id: "cv_tiana",
        lm_path: "https://res.cloudinary.com/demo/raw/upload/lm_tiana.pdf",
        lm_public_id: "lm_tiana",
        statut: "En attente",
        date_candidature: new Date("2025-05-25"),
        updatedAt: now,
      },
      // Étudiant 7 postule pour Offre 1 (Laravel) avec Profil 1
      {
        EtudiantId: 7,
        OffreId: 1,
        ProfilId: 1,
        cv_path: "https://res.cloudinary.com/demo/raw/upload/cv_sanda.pdf",
        cv_public_id: "cv_sanda",
        lm_path: "https://res.cloudinary.com/demo/raw/upload/lm_sanda.pdf",
        lm_public_id: "lm_sanda",
        statut: "En attente",
        date_candidature: new Date("2024-12-19"),
        updatedAt: now,
      },
      // Étudiant 8 postule pour Offre 5 (Full Stack) avec Profil 2 (ReactJS)
      {
        EtudiantId: 8,
        OffreId: 5,
        ProfilId: 2,
        cv_path: "https://res.cloudinary.com/demo/raw/upload/cv_fanja.pdf",
        cv_public_id: "cv_fanja",
        lm_path: "https://res.cloudinary.com/demo/raw/upload/lm_fanja.pdf",
        lm_public_id: "lm_fanja",
        statut: "En attente",
        date_candidature: new Date("2025-05-22"),
        updatedAt: now,
      },
      // Étudiant 9 postule pour Offre 8 (Technicien Réseau) avec Profil 4
      {
        EtudiantId: 9,
        OffreId: 8,
        ProfilId: 4,
        cv_path: "https://res.cloudinary.com/demo/raw/upload/cv_soanja.pdf",
        cv_public_id: "cv_soanja",
        lm_path: "https://res.cloudinary.com/demo/raw/upload/lm_soanja.pdf",
        lm_public_id: "lm_soanja",
        statut: "En attente",
        date_candidature: new Date("2025-06-10"),
        updatedAt: now,
      },
      // Étudiant 10 postule pour Offre 10 (Admin BDD) avec Profil 10
      {
        EtudiantId: 10,
        OffreId: 10,
        ProfilId: 10,
        cv_path: "https://res.cloudinary.com/demo/raw/upload/cv_toky.pdf",
        cv_public_id: "cv_toky",
        lm_path: "https://res.cloudinary.com/demo/raw/upload/lm_toky.pdf",
        lm_public_id: "lm_toky",
        statut: "En attente",
        date_candidature: new Date("2025-06-12"),
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert("candidatures", candidatures, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("candidatures", null, {});
  },
};
