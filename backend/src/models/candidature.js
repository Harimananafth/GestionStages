'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class candidature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      candidature.belongsTo(models.Etudiant);
      candidature.belongsTo(models.Offre);
    }
  }
  candidature.init({
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
        }
      }
    }
  }, {
    sequelize,
    modelName: 'candidature',
    timestamps: true,
    createdAt: 'date_candidature'
  });
  return candidature;
};