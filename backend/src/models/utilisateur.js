'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    static associate(models) {
      Utilisateur.belongsToMany(models.Role, {
        through: models.UtilisateurRole,
        foreignKey: 'id_utilisateur',
        otherKey: 'id_role'
      });
      Utilisateur.hasMany(models.Notification);
      Utilisateur.hasMany(models.Etudiant);
    }
  }

  Utilisateur.init({
    googleId: { type: DataTypes.STRING, unique: true, allowNull: true },
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
    name: { type: DataTypes.STRING, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: true },
    photo: { type: DataTypes.STRING, allowNull: true },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: 'Utilisateur',
    tableName: 'utilisateurs',
    timestamps: true
  });

  // Hook après création pour assigner rôle par défaut
  Utilisateur.afterCreate(async (user, options) => {
    const { Role } = sequelize.models;
    const defaultRole = await Role.findOne({ where: { libelle: 'user' } });
    if (defaultRole) {
      await user.addRole(defaultRole);
      console.log(`Rôle 'user' assigné automatiquement à l'utilisateur ${user.email}`);
    }
  });

  return Utilisateur;
};
