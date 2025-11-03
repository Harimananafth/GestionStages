"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Candidature extends Model {
    static associate(models) {
      Candidature.belongsTo(models.Etudiant);
      Candidature.belongsTo(models.Offre);
      Candidature.belongsTo(models.Profil);
    }
  }

  Candidature.init(
    {
      cv_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cv_public_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lm_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lm_public_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      statut: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "En attente",
        validate: {
          isIn: {
            args: [["En attente", "Acceptée", "Refusée"]],
            msg: 'Le statut doit être "En attente", "Acceptée" ou "Refusée"',
          },
        },
      },
      ProfilId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "profils",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Candidature",
      tableName: "candidatures",
      timestamps: true,
      createdAt: "date_candidature",
    }
  );

  return Candidature;
};
