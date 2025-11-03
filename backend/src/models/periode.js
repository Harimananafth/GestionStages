  'use strict';
  const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class Periode extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        Periode.hasMany(models.Offre);
      }
    }
    Periode.init({
      date_debut: {
        type : DataTypes.DATE,
        allowNull: false,      
        validate: {
          notNull: { msg: 'La date de début est requise' },
          notEmpty: { msg: 'La date de début ne peut pas être vide' }
        }
      },
      date_fin : {
        type : DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: 'La date de fin est requise' },
          notEmpty: { msg: 'La date de fin ne peut pas être vide' }
        }
      }
    }, {
      sequelize,
      modelName: 'Periode',
      tableName: 'periodes',
      timestamps: true
    });
    return Periode;
  };