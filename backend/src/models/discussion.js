"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Discussion extends Model {
    static associate(models) {
      // Une discussion appartient à UN seul étudiant (via Utilisateur)
      Discussion.belongsTo(models.Utilisateur, {
        foreignKey: "UtilisateurId",
        as: "etudiant", // Alias pour inclure l'étudiant
      });

      // Une discussion a plusieurs messages
      Discussion.hasMany(models.Message, {
        foreignKey: "DiscussionId",
        as: "messages",
      });
    }
  }

  Discussion.init(
    {
      UtilisateurId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "utilisateurs", 
          key: "id",
        },
        unique: true, // Un étudiant ne peut avoir QU'UNE SEULE discussion
      },
      statut: {
        type: DataTypes.ENUM("ouvert", "fermé"),
        defaultValue: "ouvert",
        allowNull: false,
      },
      dernierMessageAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "Discussion",
      tableName: "discussions",
      timestamps: true,
    }
  );
  return Discussion;
};
