'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profil extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      profil.belongsToMany(models.Offre, { through: models.OffreProfil } );
    }
  }
  profil.init({
    nomProfil: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le nom du profil est requis' },
        notEmpty: { msg: 'Le nom du profil ne peut pas être vide' }
      }
    },
    descriptionProfil: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'La description du profil est requis' },
        notEmpty: { msg: 'La description ne peut pas être vide' }
      }
    }
  }, {
    sequelize,
    modelName: 'profil',
    timestamps: true
  });
  return profil;
};