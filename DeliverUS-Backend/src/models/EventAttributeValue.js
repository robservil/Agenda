import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class EventAttributeValue extends Model {
    static associate (models) {
      EventAttributeValue.belongsTo(models.Event, { foreignKey: 'eventId' })
      EventAttributeValue.belongsTo(models.CustomAttribute, { foreignKey: 'customAttributeId' })
    }
  }

  EventAttributeValue.init({
    // id is not included in the model's attributes but is present in the database
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
    customAttributeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CustomAttributes',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    value: {
      type: DataTypes.JSON,
      allowNull: false
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
    modelName: 'EventAttributeValue',
    tableName: 'EventAttributeValues',
    timestamps: true
  })

  return EventAttributeValue
}

export default loadModel
