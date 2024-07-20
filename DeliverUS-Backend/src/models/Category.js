import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate (models) {
      // define association here
      Category.belongsToMany(models.Event, { through: models.EventCategory, foreignKey: 'categoryId' })
    }
  }

  Category.init({
    name: {
      allowNull: false,
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
    }
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    timestamps: true
  })

  return Category
}

export default loadModel
