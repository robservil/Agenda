import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class EventPermission extends Model {
    static associate (models) {
      EventPermission.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' })
      EventPermission.belongsTo(models.Event, { foreignKey: 'eventId', onDelete: 'CASCADE' })
    }
  }

  EventPermission.init({
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
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    canEditEvent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    canCreateGlobalReminders: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
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
    modelName: 'EventPermission',
    tableName: 'EventPermissions',
    timestamps: true
  })

  return EventPermission
}

export default loadModel
