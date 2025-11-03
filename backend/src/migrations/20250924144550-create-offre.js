'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('offres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PeriodeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'periodes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      titre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_disponible: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue : true
      },
      date_publication: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('offres');
  }
};