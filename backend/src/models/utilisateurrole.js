'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UtilisateurRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UtilisateurRole.init(
    {
      //pas d'attribut
    },
    {
    sequelize,
    tableName: 'utilisateurRoles',
    modelName: 'UtilisateurRole',
    timestamps: true
  });
  return UtilisateurRole;
};