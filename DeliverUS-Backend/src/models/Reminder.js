import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class Reminder extends Model {
    static associate (models) {
      // Un recordatorio pertenece a un evento
      Reminder.belongsTo(models.Event, { foreignKey: 'eventId', onDelete: 'CASCADE' })
      // Un recordatorio puede estar asociado a muchos usuarios
      Reminder.belongsToMany(models.User, { through: models.UserReminder, foreignKey: 'reminderId' })
      // Asociaciones con los tipos de recordatorios específicos
      Reminder.hasOne(models.UniqueReminder, { foreignKey: 'reminderId' })
      Reminder.hasOne(models.RecurringReminder, { foreignKey: 'reminderId' })
      Reminder.hasOne(models.DateBasedReminder, { foreignKey: 'reminderId' })
    }
  }

  Reminder.init({
    type: {
      type: DataTypes.ENUM('unique', 'recurring', 'date-based'),
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isGlobal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Reminder',
    tableName: 'Reminders',
    timestamps: true
  })

  return Reminder
}

export default loadModel
