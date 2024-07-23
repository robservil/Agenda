import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class EventInvitation extends Model {
    static associate (models) {
      EventInvitation.belongsTo(models.Event, { foreignKey: 'eventId' })
      EventInvitation.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }

  EventInvitation.init({
    eventId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Events',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    canShare: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    accepted: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
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
    modelName: 'EventInvitation',
    tableName: 'EventInvitations',
    timestamps: true
  })

  return EventInvitation
}

export default loadModel
