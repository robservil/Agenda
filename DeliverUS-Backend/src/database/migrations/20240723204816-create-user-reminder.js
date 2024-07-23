'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserReminders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      reminderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Reminders',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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

    await queryInterface.addConstraint('UserReminders', {
      fields: ['userId', 'reminderId'],
      type: 'unique',
      name: 'unique_user_reminder'
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('UserReminders')
  }
}
