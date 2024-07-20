import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class EnumValue extends Model {
    static associate (models) {
      EnumValue.belongsTo(models.CustomAttribute, { foreignKey: 'customAttributeId' })
    }
  }

  EnumValue.init({
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customAttributeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'CustomAttributes',
        key: 'id'
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
    }
  }, {
    sequelize,
    modelName: 'EnumValue',
    tableName: 'EnumValues'
  })

  return EnumValue
}

export default loadModel
