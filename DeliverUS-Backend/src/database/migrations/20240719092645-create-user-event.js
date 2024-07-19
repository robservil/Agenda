'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserEvents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Nombre de la tabla referenciada
          key: 'id'
        },
        onDelete: 'CASCADE' // Elimina las interacciones si el usuario se elimina
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Events', // Nombre de la tabla referenciada
          key: 'id'
        },
        onDelete: 'CASCADE' // Elimina las interacciones si el evento se elimina
      },
      status: {
        type: Sequelize.ENUM,
        values: ['completado', 'pendiente', 'pasado'],
        allowNull: false
      },
      reasonPassed: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      reasonIncompleted: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          min: 1,
          max: 5
        }
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
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('UserEvents')
  }
}
