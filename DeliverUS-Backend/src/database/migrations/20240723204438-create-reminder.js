'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Reminders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('unique', 'recurring', 'date-based'),
        allowNull: false
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isGlobal: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'id'
        },
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('Reminders')
  }
}
