'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Notification.belongsTo(models.Utilisateur); 
    }
  }
  Notification.init({
    message: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le message est requis' },
        notEmpty: { msg: 'Le message ne peut pas être vide' }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['simple', 'actualité']],
          msg: "Le type doit être 'simple' ou 'actualité'"
        },
        notNull: { msg: 'Le type est requis' },
        notEmpty: { msg: 'Le type ne peut pas être vide' }
      }
    },
    lu: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notification',
    timestamps: true,
    createdAt: 'date_envoi'
  });
  return Notification;
};