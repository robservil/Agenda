import Sequelize from 'sequelize'
import getEnvironmentConfig from '../config/config.js'
import loadRestaurantModel from './Restaurant.js'
import loadOrderModel from './Order.js'
import loadProductModel from './Product.js'
import loadProductCategoryModel from './ProductCategory.js'
import loadRestaurantCategoryModel from './RestaurantCategory.js'
import loadUserModel from './User.js'
import loadEventModel from './Event.js'
import loadUserEventModel from './UserEvent.js'
import loadCategoryModel from './Category.js'
import loadEventCategoryModel from './EventCategory.js'
import loadCustomAttributeModel from './CustomAttribute.js'
import loadEnumValueModel from './EnumValue.js'
import loadEventAttributeValue from './EventAttributeValue.js'

const sequelizeSession = new Sequelize(getEnvironmentConfig().database, getEnvironmentConfig().username, getEnvironmentConfig().password, getEnvironmentConfig())
const Restaurant = loadRestaurantModel(sequelizeSession, Sequelize.DataTypes)
const Order = loadOrderModel(sequelizeSession, Sequelize.DataTypes)
const Product = loadProductModel(sequelizeSession, Sequelize.DataTypes)
const ProductCategory = loadProductCategoryModel(sequelizeSession, Sequelize.DataTypes)
const RestaurantCategory = loadRestaurantCategoryModel(sequelizeSession, Sequelize.DataTypes)
const User = loadUserModel(sequelizeSession, Sequelize.DataTypes)
const Event = loadEventModel(sequelizeSession, Sequelize.DataTypes)
const UserEvent = loadUserEventModel(sequelizeSession, Sequelize.DataTypes)
const Category = loadCategoryModel(sequelizeSession, Sequelize.DataTypes)
const EventCategory = loadEventCategoryModel(sequelizeSession, Sequelize.DataTypes)
const CustomAttribute = loadCustomAttributeModel(sequelizeSession, Sequelize.DataTypes)
const EnumValue = loadEnumValueModel(sequelizeSession, Sequelize.DataTypes)
const EventAttributeValue = loadEventAttributeValue(sequelizeSession, Sequelize.DataTypes)

const db = { Restaurant, Order, Product, ProductCategory, RestaurantCategory, User, Event, UserEvent, Category, EventCategory, CustomAttribute, EnumValue, EventAttributeValue }

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

export { Restaurant, Order, Product, ProductCategory, RestaurantCategory, User, Event, UserEvent, Category, EventCategory, CustomAttribute, EnumValue, EventAttributeValue, sequelizeSession }
