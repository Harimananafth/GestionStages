'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Etudiant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Etudiant.belongsTo(models.Utilisateur);
      Etudiant.hasMany(models.Candidature);
    }
  }
  Etudiant.init({
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le nom est requis' },
        notEmpty: { msg: 'Le nom ne peut pas être vide' },
        len: {
          args: [2, 50],
          msg: 'Le nom doit contenir entre 2 et 50 caractères'
        }
      }
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le prenom est requis' },
        notEmpty: { msg: 'Le prenom ne peut pas être vide' },
        len: {
          args: [2, 50],
          msg: 'Le prenom doit contenir entre 2 et 50 caractères'
        }
      }
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le téléphone est requis' },
        notEmpty: { msg: 'Le téléphone ne peut pas être vide' },
        is: {
          args: /^03[0-9]{8}$/,
          msg: 'Le téléphone doit commencer par 03 et contenir exactement 10 chiffres'
        }
      }
    },
    adresse: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'L\'adresse est requise' },
        notEmpty: { msg: 'L\'adresse ne peut pas être vide' },
        len: {
          args: [5, 100],
          msg: 'L\'adresse doit contenir entre 5 et 100 caractères'
        }
      }
    },
    ecole: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le nom de l\'ecole est requise' },
        notEmpty: { msg: 'Le nom de l\'ecole ne peut pas être vide' },
        min: {
          args: [2],
          msg: 'Le nom de l\'ecole doit contenir au moins 2 caractères'
        }
      }
    },
    niveau: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le niveau est requis' },
        notEmpty: { msg: 'Le niveau ne peut pas être vide' },
        len: {
          args: [2, 20],
          msg: 'Le niveau doit contenir entre 2 et 20 caractères'
        }
      }
    },
    specialite: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'La spécialité est requise' },
        notEmpty: { msg: 'La spécialité ne peut pas être vide' },
        len: {
          args: [3, 50],
          msg: 'La spécialité doit contenir entre 3 et 50 caractères'
        }
      }
    },
    diplome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le diplôme est requis' },
        notEmpty: { msg: 'Le diplôme ne peut pas être vide' },
        len: {
          args: [2, 50],
          msg: 'Le diplôme doit contenir entre 2 et 50 caractères'
        }
      }
    }
  }, {
    sequelize,
    tableName: 'etudiants',
    modelName: 'Etudiant',
    timestamps: true
  });
  return Etudiant;
};