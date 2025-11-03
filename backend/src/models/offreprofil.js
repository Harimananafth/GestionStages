'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OffreProfil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OffreProfil.init({
    nbProfil: {
      type : DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le nombre de profil est requis' },
        notEmpty: { msg: 'Le nombre de profil ne peut pas être vide' },
        isInt: { msg: 'Le nombre de profil doit être un entier' },
        min: {
          args: [1],
          msg: 'Le nombre de profil doit être au moins 1'
        }
      }
    }
  }, {
    sequelize,
    tableName: 'offreProfils',
    modelName: 'OffreProfil',
    timestamps: true
  });
  return OffreProfil;
};