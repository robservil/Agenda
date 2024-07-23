'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UniqueReminders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reminderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Reminders',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      reminderDateTime: {
        type: Sequelize.DATE,
        allowNull: false
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
    await queryInterface.dropTable('UniqueReminders')
  }
}
