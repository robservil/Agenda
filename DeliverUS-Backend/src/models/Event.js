import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Event.belongsTo(models.User, { as: 'creator', foreignKey: 'createdBy' })
      Event.belongsTo(models.Color, { as: 'color', foreignKey: 'colorId', onDelete: 'SET NULL' })
      Event.belongsToMany(models.User, { through: models.UserEvent, foreignKey: 'eventId' })
      Event.belongsToMany(models.Category, { through: models.EventCategory, foreignKey: 'eventId' })
      Event.belongsToMany(models.CustomAttribute, { through: models.EventAttributeValue, foreignKey: 'eventId' })
      Event.belongsToMany(models.User, { through: models.EventInvitation, foreignKey: 'eventId' })
      Event.belongsToMany(models.User, { through: models.EventPermission, foreignKey: 'eventId' })
      Event.hasMany(models.Reminder, { foreignKey: 'eventId' })
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
    endDate: {
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
    },
    colorId: {
      allowNull: true,
      type: DataTypes.STRING,
      references: {
        model: 'Colors',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Events',
    timestamps: true
  })
  return Event
}

export default loadModel
