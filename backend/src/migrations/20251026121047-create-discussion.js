"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("discussions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UtilisateurId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "utilisateurs", 
          key: "id",
        },
        onDelete: "CASCADE",
        unique: true, 
      },
      statut: {
        type: Sequelize.ENUM("ouvert", "fermé"),
        defaultValue: "ouvert",
        allowNull: false,
      },
      dernierMessageAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
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
    await queryInterface.dropTable("discussions");
  },
};
