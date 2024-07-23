import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class UniqueReminder extends Model {
    static associate (models) {
      UniqueReminder.belongsTo(models.Reminder, { foreignKey: 'reminderId', onDelete: 'CASCADE' })
    }
  }

  UniqueReminder.init({
    reminderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Reminders',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    reminderDateTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UniqueReminder',
    tableName: 'UniqueReminders',
    timestamps: true
  })

  return UniqueReminder
}

export default loadModel
