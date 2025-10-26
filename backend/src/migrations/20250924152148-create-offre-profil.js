"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("offreProfils", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      OffreId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "offres",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      ProfilId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "profils",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      nbProfil: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
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

    await queryInterface.addConstraint("offreProfils", {
      fields: ["OffreId", "ProfilId"],
      type: "unique",
      name: "unique_offre_profil",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("offreProfils");
  },
};
