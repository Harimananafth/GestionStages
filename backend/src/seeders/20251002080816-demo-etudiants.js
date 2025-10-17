'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('etudiants', [
      // 1: Alice (UtilisateurId: 2) - Full-Stack
      {
        UtilisateurId: 2,
        nom: 'Dupont',
        prenom: 'Alice',
        telephone: '0611223344',
        adresse: '10 Rue de la Paix, Paris',
        ecole: 'Epitech',
        niveau: 'M2',
        specialite: 'Développement Web',
        diplome: 'Master Informatique',
        createdAt: now,
        updatedAt: now
      },
      // 2: Bob (UtilisateurId: 3) - Admin Réseau
      {
        UtilisateurId: 3,
        nom: 'Martin',
        prenom: 'Bob',
        telephone: '0622334455',
        adresse: '25 Avenue des Champs, Lyon',
        ecole: '42',
        niveau: 'L3',
        specialite: 'Administration Système et Réseau',
        diplome: 'Bachelor Informatique',
        createdAt: now,
        updatedAt: now
      },
      // 3: Claire (UtilisateurId: 4) - UX/UI
      {
        UtilisateurId: 4,
        nom: 'Durand',
        prenom: 'Claire',
        telephone: '0633445566',
        adresse: '5 Boulevard Jean Jaurès, Marseille',
        ecole: 'HETIC',
        niveau: 'M1',
        specialite: 'Design Numérique',
        diplome: 'Licence Design',
        createdAt: now,
        updatedAt: now
      },
      // 4: David (UtilisateurId: 5) - Full-Stack
      {
        UtilisateurId: 5,
        nom: 'Petit',
        prenom: 'David',
        telephone: '0644556677',
        adresse: '8 Rue du Code, Lille',
        ecole: 'Epitech',
        niveau: 'M2',
        specialite: 'Développement Web',
        diplome: 'Master Informatique',
        createdAt: now,
        updatedAt: now
      },
      // 5: Eva (UtilisateurId: 6) - Data Science
      {
        UtilisateurId: 6,
        nom: 'Roy',
        prenom: 'Eva',
        telephone: '0655667788',
        adresse: '30 Place du Capitole, Toulouse',
        ecole: 'ENSIMAG',
        niveau: 'M2',
        specialite: 'Data Science',
        diplome: 'Master Data Science',
        createdAt: now,
        updatedAt: now
      },
      // 6: Fabien (UtilisateurId: 7) - Admin Réseau
      {
        UtilisateurId: 7,
        nom: 'Moreau',
        prenom: 'Fabien',
        telephone: '0666778899',
        adresse: '12 Quai de la Garonne, Bordeaux',
        ecole: '42',
        niveau: 'L3',
        specialite: 'Administration Système et Réseau',
        diplome: 'Bachelor Informatique',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('etudiants', null, {});
  }
};