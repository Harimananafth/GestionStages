"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // Un message appartient à une discussion
      Message.belongsTo(models.Discussion, {
        foreignKey: "DiscussionId",
      });

      // Un message est envoyé par UN utilisateur (admin ou étudiant)
      Message.belongsTo(models.Utilisateur, {
        foreignKey: "UtilisateurId",
        as: "envoyeur", // Alias pour l'envoyeur
      });
    }
  }

  Message.init(
    {
      DiscussionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "discussions",
          key: "id",
        },
      },
      UtilisateurId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "utilisateurs",
          key: "id",
        },
      },
      contenu: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      estLu: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "messages",
      timestamps: true,
    }
  );
  return Message;
};
