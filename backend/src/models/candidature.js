'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Candidature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Candidature.belongsTo(models.Etudiant);
      Candidature.belongsTo(models.Offre);
    }
  }
  Candidature.init({
    cv_path: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le chemin du CV est requis' },
        notEmpty: { msg: 'Le chemin du CV ne peut pas être vide' }
      }
    },
    lm_path: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le chemin de la lettre de motivation est requis' },
        notEmpty: { msg: 'Le chemin de la lettre de motivation ne peut pas être vide' }
      }
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'En attente',
      validate: {
        isIn: {
          args: [['En attente', 'Acceptée', 'Refusée']],
          msg: 'Le statut doit être "En attente", "Acceptée" ou "Refusée"'
        },
        notNull: { msg: 'Le statut est requis' },
        notEmpty: { msg: 'Le statut ne peut pas être vide' }
      }
    }
  }, {
    sequelize,
    modelName: 'Candidature',
    tableName: 'candidatures',
    timestamps: true,
    createdAt: 'date_candidature'
  });
  return Candidature;
};