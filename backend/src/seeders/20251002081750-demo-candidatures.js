"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Scénario Offre 1 (Full-Stack, 2 places)
    const cand1_offre1 = {
      EtudiantId: 1, // Alice (Full-Stack)
      OffreId: 1,
      ProfilId: 1, // Profil Full-Stack
      cv_path: "uploads/cv_alice_dupont.pdf",
      lm_path: "uploads/lm_alice_dupont.pdf",
      cv_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      lm_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      statut: "Acceptée", // Prend 1/2 places
      date_candidature: new Date(now.getTime() - 8 * 86400000), // Candidate il y a 8j
      updatedAt: new Date(now.getTime() - 2 * 86400000), // Acceptée il y a 2j
    };

    const cand2_offre1 = {
      EtudiantId: 4, // David (Full-Stack)
      OffreId: 1,
      ProfilId: 1, // Profil Full-Stack
      cv_path: "uploads/cv_david_petit.pdf",
      lm_path: "uploads/lm_david_petit.pdf",
      cv_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      lm_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      statut: "Acceptée", // Prend 2/2 places
      date_candidature: new Date(now.getTime() - 7 * 86400000),
      updatedAt: new Date(now.getTime() - 1 * 86400000), // Accepté hier
    };

    // Cette candidature sera "Refusée" car elle postule au même profil, mais on peut aussi la refuser pour d'autres raisons.
    const cand3_offre1 = {
      EtudiantId: 3, // Claire (UX/UI) - Tente sa chance
      OffreId: 1,
      ProfilId: 1, // Profil Full-Stack
      cv_path: "uploads/cv_claire_durand.pdf",
      lm_path: "uploads/lm_claire_durand.pdf",
      cv_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      lm_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      statut: "Refusée", // N'occupe pas de place
      date_candidature: new Date(now.getTime() - 6 * 86400000),
      updatedAt: new Date(now.getTime() - 3 * 86400000),
    };

    // Scénario Offre 2 (Admin Réseau, 1 place)
    const cand1_offre2 = {
      EtudiantId: 2, // Bob (Admin Réseau)
      OffreId: 2,
      ProfilId: 2, // Profil Admin Réseau
      cv_path: "uploads/cv_bob_martin.pdf",
      lm_path: "uploads/lm_bob_martin.pdf",
      cv_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      lm_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      statut: "Acceptée", // Prend 1/1 place
      date_candidature: new Date(now.getTime() - 7 * 86400000),
      updatedAt: new Date(now.getTime() - 4 * 86400000),
    };

    // Fabien postule au même slot. Il reste 'En attente' car la place est prise.
    const cand2_offre2 = {
      EtudiantId: 6, // Fabien (Admin Réseau)
      OffreId: 2,
      ProfilId: 2, // Profil Admin Réseau
      cv_path: "uploads/cv_fabien_moreau.pdf",
      lm_path: "uploads/lm_fabien_moreau.pdf",
      cv_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      lm_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      statut: "En attente", // Reste en attente
      date_candidature: new Date(now.getTime() - 3 * 86400000),
      updatedAt: new Date(now.getTime() - 3 * 86400000),
    };

    // Scénario Offre 3 (Data, 2 places)
    const cand1_offre3 = {
      EtudiantId: 5, // Eva (Data)
      OffreId: 3,
      ProfilId: 3, // Profil Data
      cv_path: "uploads/cv_eva_roy.pdf",
      lm_path: "uploads/lm_eva_roy.pdf",
      cv_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      lm_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      statut: "En attente", // 0/2 places prises
      date_candidature: new Date(now.getTime() - 4 * 86400000),
      updatedAt: new Date(now.getTime() - 4 * 86400000),
    };

    // Scénario Offre 4 (Multi, 1 Full-Stack, 2 Mobile)
    const cand1_offre4 = {
      EtudiantId: 1, // Alice (Full-Stack)
      OffreId: 4,
      ProfilId: 1, // Postule au slot Full-Stack
      cv_path: "uploads/cv_alice_dupont_bis.pdf",
      lm_path: "uploads/lm_alice_dupont_bis.pdf",
      cv_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      lm_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      statut: "En attente",
      date_candidature: new Date(now.getTime() - 1 * 86400000),
      updatedAt: new Date(now.getTime() - 1 * 86400000),
    };

    // Scénario Offre 5 (Ancienne, 1 UX/UI, 1 Chef Projet)
    const cand1_offre5 = {
      EtudiantId: 3, // Claire (UX/UI)
      OffreId: 5,
      ProfilId: 4, // Profil UX/UI
      cv_path: "uploads/cv_claire_durand_old.pdf",
      lm_path: "uploads/lm_claire_durand_old.pdf",
      cv_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      lm_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      statut: "Acceptée", // Place prise (dans le passé)
      date_candidature: new Date(now.getTime() - 80 * 86400000),
      updatedAt: new Date(now.getTime() - 70 * 86400000),
    };

    const cand2_offre5 = {
      EtudiantId: 6, // Fabien (Admin Réseau)
      OffreId: 5,
      ProfilId: 6, // Postule pour Chef de Projet
      cv_path: "uploads/cv_fabien_moreau_old.pdf",
      lm_path: "uploads/lm_fabien_moreau_old.pdf",
      cv_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      lm_public_id: "aaaaaaaaaaaaaaaaaaaaaa",
      statut: "Refusée",
      date_candidature: new Date(now.getTime() - 75 * 86400000),
      updatedAt: new Date(now.getTime() - 70 * 86400000),
    };

    await queryInterface.bulkInsert(
      "candidatures",
      [
        cand1_offre1,
        cand2_offre1,
        cand3_offre1,
        cand1_offre2,
        cand2_offre2,
        cand1_offre3,
        cand1_offre4,
        cand1_offre5,
        cand2_offre5,
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("candidatures", null, {});
  },
};
