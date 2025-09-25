'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('candidatures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_etudiant: {
        type: Sequelize.INTEGER,
        references: {
          model: 'etudiants',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_offre: {
        type: Sequelize.INTEGER,
        references: {
          model: 'offres',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      cv_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lm_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      statut: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'En attente',
        enum : ['En attente', 'Acceptée', 'Refusée']
      },
      date_candidature: {
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
    await queryInterface.dropTable('candidatures');
  }
};