import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class UserReminder extends Model {
    static associate (models) {
      // Un UserReminder pertenece a un usuario
      UserReminder.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' })
      // Un UserReminder pertenece a un recordatorio
      UserReminder.belongsTo(models.Reminder, { foreignKey: 'reminderId', onDelete: 'CASCADE' })
    }
  }

  UserReminder.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    reminderId: {
      type: DataTypes.INTEGER,
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
    modelName: 'UserReminder',
    tableName: 'UserReminders',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'reminderId']
      }
    ]
  })

  return UserReminder
}

export default loadModel
