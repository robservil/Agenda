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
import loadEventAttributeValueModel from './EventAttributeValue.js'
import loadColorModel from './Color.js'
import loadReminderModel from './Reminder.js'
import loadEventInvitationModel from './EventInvitation.js'
import loadEventPermissionModel from './EventPermission.js'
import loadUserReminderModel from './UserReminder.js'
import loadUniqueReminderModel from './UniqueReminder.js'
import loadRecurringReminderModel from './RecurringReminder.js'
import loadDateBasedReminderModel from './DateBasedReminder.js'

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
const EventAttributeValue = loadEventAttributeValueModel(sequelizeSession, Sequelize.DataTypes)
const Color = loadColorModel(sequelizeSession, Sequelize.DataTypes)
const Reminder = loadReminderModel(sequelizeSession, Sequelize.DataTypes)
const EventInvitation = loadEventInvitationModel(sequelizeSession, Sequelize.DataTypes)
const EventPermission = loadEventPermissionModel(sequelizeSession, Sequelize.DataTypes)
const UserReminder = loadUserReminderModel(sequelizeSession, Sequelize.DataTypes)
const UniqueReminder = loadUniqueReminderModel(sequelizeSession, Sequelize.DataTypes)
const RecurringReminder = loadRecurringReminderModel(sequelizeSession, Sequelize.DataTypes)
const DateBasedReminder = loadDateBasedReminderModel(sequelizeSession, Sequelize.DataTypes)

const db = { Restaurant, Order, Product, ProductCategory, RestaurantCategory, User, Event, UserEvent, Category, EventCategory, CustomAttribute, EventAttributeValue, Color, EventInvitation, Reminder, UserReminder, EventPermission, UniqueReminder, RecurringReminder, DateBasedReminder }

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

export { Restaurant, Order, Product, ProductCategory, RestaurantCategory, User, Event, UserEvent, Category, EventCategory, CustomAttribute, EventAttributeValue, Color, EventInvitation, Reminder, UserReminder, EventPermission, UniqueReminder, RecurringReminder, DateBasedReminder, sequelizeSession }
