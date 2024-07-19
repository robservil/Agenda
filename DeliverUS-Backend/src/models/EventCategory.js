import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class EventCategory extends Model {
    static associate (models) {
      EventCategory.belongsTo(models.Event, { foreignKey: 'eventId' })
      EventCategory.belongsTo(models.Category, { foreignKey: 'categoryId' })
    }
  }

  EventCategory.init({
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id'
      },
      primaryKey: true
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      },
      primaryKey: true
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
    modelName: 'EventCategory',
    tableName: 'EventCategories'
  })

  return EventCategory
}

export default loadModel
