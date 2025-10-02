'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class UtilisateurRole extends Model {
    static associate(models) {
      UtilisateurRole.belongsTo(models.Utilisateur, { foreignKey: 'id_utilisateur' });
      UtilisateurRole.belongsTo(models.Role, { foreignKey: 'id_role' });
    }
  }

  UtilisateurRole.init(
    {
      id_role: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id'
        }
      },
      id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'utilisateurs',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      tableName: 'utilisateurRoles',
      modelName: 'UtilisateurRole',
      timestamps: true
    }
  );

  return UtilisateurRole;
};
