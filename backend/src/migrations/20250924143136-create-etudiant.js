'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('etudiants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING
      },
      prenom: {
        type: Sequelize.STRING
      },
      telephone: {
        type: Sequelize.STRING
      },
      adresse: {
        type: Sequelize.STRING
      },
      ecole: {
        type: Sequelize.STRING
      },
      niveau: {
        type: Sequelize.STRING
      },
      specialite: {
        type: Sequelize.STRING
      },
      diplome: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('etudiants');
  }
};