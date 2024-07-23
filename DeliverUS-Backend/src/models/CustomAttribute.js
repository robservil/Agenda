import { Model } from 'sequelize'

const loadModel = (sequelize, DataTypes) => {
  class CustomAttribute extends Model {
    static associate (models) {
      CustomAttribute.belongsToMany(models.Event, { through: models.EventAttributeValue, foreignKey: 'customAttributeId' })
    }
  }

  CustomAttribute.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('integer', 'string', 'date', 'array', 'enum', 'file'),
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
    modelName: 'CustomAttribute',
    tableName: 'CustomAttributes',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['name', 'type']
      }
    ]
  })

  return CustomAttribute
}

export default loadModel
