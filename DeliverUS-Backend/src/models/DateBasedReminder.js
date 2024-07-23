import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class DateBasedReminder extends Model {
    static associate (models) {
      DateBasedReminder.belongsTo(models.Reminder, { foreignKey: 'reminderId', onDelete: 'CASCADE' })
    }
  }

  DateBasedReminder.init({
    reminderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Reminders',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    reminderDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'DateBasedReminder',
    tableName: 'DateBasedReminders',
    timestamps: true
  })

  return DateBasedReminder
}

export default loadModel
