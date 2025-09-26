'use strict';
const {
  Model
} = require('sequelize');
const Utilisateur = require('./Utilisateur');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.belongsToMany(models.Utilisateur, { through: models.UtilisateurRole } );
    }
  }
  Role.init({
    libelle: {
      type : DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le libellé est requis' },
        notEmpty: { msg: 'Le libellé ne peut pas être vide' }
      }
    } 
  }, {
    sequelize,
    modelName: 'Role',
    timestamps: true
  });
  return Role;
};