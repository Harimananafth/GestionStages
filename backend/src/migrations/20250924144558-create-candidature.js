"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("candidatures", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      EtudiantId: {
        type: Sequelize.INTEGER,
        references: {
          model: "etudiants",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      OffreId: {
        type: Sequelize.INTEGER,
        references: {
          model: "offres",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      ProfilId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "profils",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      cv_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cv_public_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lm_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lm_public_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      statut: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "En attente",
      },
      date_candidature: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("candidatures");
  },
};
