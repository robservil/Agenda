import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class UserEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      UserEvent.belongsTo(models.User, { foreignKey: 'userId' })
      UserEvent.belongsTo(models.Event, { foreignKey: 'eventId' })
    }
  }

  UserEvent.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: ['completado', 'pendiente', 'pasado'],
      allowNull: false
    },
    reasonPassed: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reasonIncompleted: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
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
    modelName: 'UserEvent',
    tableName: 'UserEvents'
  })

  return UserEvent
}

export default loadModel
