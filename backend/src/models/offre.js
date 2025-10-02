'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Offre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Offre.hasMany(models.Candidature);
      Offre.belongsTo(models.Periode);
      Offre.belongsToMany(models.Profil, { through: models.OffreProfil } );
    }
  }
  Offre.init({
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Le titre est requis' },
        notEmpty: { msg: 'Le titre ne peut pas être vide' }
      }
    }
  }, {
    sequelize,
    tableName: 'offres',
    modelName: 'Offre',
    timestamps : true,
    createdAt : 'date_publication'
  });
  return Offre;
};