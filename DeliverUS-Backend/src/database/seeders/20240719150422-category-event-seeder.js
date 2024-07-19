'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('EventCategories', [
      { eventId: 1, categoryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 1, categoryId: 2, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 2, categoryId: 3, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 3, categoryId: 4, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 4, categoryId: 5, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 5, categoryId: 6, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 6, categoryId: 7, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 7, categoryId: 8, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 8, categoryId: 9, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 9, categoryId: 10, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 10, categoryId: 11, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 11, categoryId: 12, createdAt: new Date(), updatedAt: new Date() },
      { eventId: 12, categoryId: 1, createdAt: new Date(), updatedAt: new Date() }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('EventCategories', null, {})
  }
}
