'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdBy: {
        type: Sequelize.INTEGER,
        allowNull: true, // Permitimos valores nulos en caso de que el creador no esté definido al momento de la creación
        references: {
          model: 'Users', // Nombre de la tabla referenciada
          key: 'id'
        },
        onDelete: 'CASCADE' // Elimina los eventos cuando el usuario es eliminado
      },
      colorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Colors',
          key: 'id'
        },
        onDelete: 'SET NULL'
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Events')
  }
}
