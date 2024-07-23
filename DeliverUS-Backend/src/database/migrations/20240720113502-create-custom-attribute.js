'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CustomAttributes', {
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
      type: {
        type: Sequelize.ENUM('integer', 'string', 'date', 'array', 'enum', 'file'),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    })

    // Añadir la restricción de unicidad compuesta
    await queryInterface.addConstraint('CustomAttributes', {
      fields: ['name', 'type'],
      type: 'unique',
      name: 'unique_name_type_constraint'
    })
  },
  down: async (queryInterface, Sequelize) => {
    // Eliminar la restricción de unicidad compuesta
    await queryInterface.removeConstraint('CustomAttributes', 'unique_name_type_constraint')

    await queryInterface.dropTable('CustomAttributes')
  }
}
