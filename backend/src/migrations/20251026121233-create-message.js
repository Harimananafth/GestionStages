"use...javascript";
"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("messages", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      DiscussionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "discussions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      UtilisateurId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "utilisateurs",
          key: "id",
        },
        onDelete: "CASCADE", 
      },
      contenu: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      estLu: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("messages");
  },
};
