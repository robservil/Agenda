'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Colors', [
      { color: '#FF5733', createdAt: new Date(), updatedAt: new Date() },
      { color: '#33FF57', createdAt: new Date(), updatedAt: new Date() },
      { color: '#33578F', createdAt: new Date(), updatedAt: new Date() },
      { color: '#FF33A8', createdAt: new Date(), updatedAt: new Date() },
      { color: '#B833FF', createdAt: new Date(), updatedAt: new Date() },
      { color: '#FFC300', createdAt: new Date(), updatedAt: new Date() },
      { color: '#33FFF6', createdAt: new Date(), updatedAt: new Date() },
      { color: '#FF5833', createdAt: new Date(), updatedAt: new Date() },
      { color: '#33F957', createdAt: new Date(), updatedAt: new Date() },
      { color: '#3357FF', createdAt: new Date(), updatedAt: new Date() },
      { color: '#FF43A8', createdAt: new Date(), updatedAt: new Date() },
      { color: '#A833FF', createdAt: new Date(), updatedAt: new Date() }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Colors', null, {})
  }
}
