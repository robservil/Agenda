import { Model } from 'sequelize'

const loadEventModel = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Event.belongsToMany(models.User, { through: models.UserEvent, foreignKey: 'eventId' })
      Event.belongsTo(models.User, { as: 'creator', foreignKey: 'createdBy' })
    }
  }
  Event.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    ednDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    location: {
      allowNull: true,
      type: DataTypes.STRING
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
    },
    createdBy: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // Name of the table, not the model
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Events'
  })
  return Event
}

export default loadEventModel
