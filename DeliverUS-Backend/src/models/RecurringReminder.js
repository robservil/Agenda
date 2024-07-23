import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class RecurringReminder extends Model {
    static associate (models) {
      RecurringReminder.belongsTo(models.Reminder, { foreignKey: 'reminderId', onDelete: 'CASCADE' })
    }
  }

  RecurringReminder.init({
    reminderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Reminders',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    repeatInterval: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nextReminderDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'RecurringReminder',
    tableName: 'RecurringReminders',
    timestamps: true
  })

  return RecurringReminder
}

export default loadModel
