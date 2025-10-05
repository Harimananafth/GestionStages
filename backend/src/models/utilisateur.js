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
    googleId : {
      type : DataTypes.STRING,
      unique : true,
      allowNull : true
    },
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
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    verificationCode: { type: DataTypes.STRING, allowNull: true },
    verificationExpires: { type: DataTypes.DATE, allowNull: true },
  }, {
    sequelize,
    modelName: 'Utilisateur',
    tableName: 'utilisateurs',
    timestamps: true
  });
  return Utilisateur;
};