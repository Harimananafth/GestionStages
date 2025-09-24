'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Utilisateur.belongsToMany(models.Role, { through: 'UtilisateurRoles' });
      Utilisateur.hasMany(models.Notification);
    }
  }
  Utilisateur.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: 'Cet email est déjà utilisé' },
      validate: {
        isEmail: { msg: 'Le format de l\'email est invalide' },
        notNull: { msg: 'L\'email est requis' },
        notEmpty: { msg: 'L\'email ne peut pas être vide' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le mot de passe est requis' },
        notEmpty: { msg: 'Le mot de passe ne peut pas être vide' },
        len: {
          args: [8, 25],
          msg: 'Le mot de passe doit contenir au moins 8 caractères'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Utilisateur',
    timestamps: true
  });
  return Utilisateur;
};