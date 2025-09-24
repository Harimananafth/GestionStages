'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class offre extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      offre.hasMany(models.Candidature);
      offre.belongsTo(models.Periode);
      offre.belongsToMany(models.Profil, { through: models.OffreProfil } );
    }
  }
  offre.init({
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
    modelName: 'offre',
    timestamps : true,
    createdAt : 'date_publication'
  });
  return offre;
};