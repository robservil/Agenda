import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class Color extends Model {
    static associate (models) {
      // define association here
      Color.hasMany(models.Event, { foreignKey: 'colorId', onDelete: 'SET NULL' })
      Color.hasMany(models.Category, { foreignKey: 'colorId', onDelete: 'SET NULL' })
    }
  }

  Color.init({
    color: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
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
    modelName: 'Color',
    tableName: 'Colors',
    timestamps: true
  })

  return Color
}

export default loadModel
