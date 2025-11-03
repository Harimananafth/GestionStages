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
      Utilisateur.belongsToMany(models.Role, {
        through: models.UtilisateurRole,
        foreignKey: 'id_utilisateur', 
        otherKey: 'id_role'          
      });
      Utilisateur.hasMany(models.Notification)
      Utilisateur.hasMany(models.Etudiant)
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
        notEmpty: { msg: 'Le mot de passe ne peut pas être vide' }
      }
    }
  }, {
    sequelize,
    modelName: 'Utilisateur',
    tableName: 'utilisateurs',
    timestamps: true
  });
  return Utilisateur;
};