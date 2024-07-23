'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      { name: 'Conferencia', colorId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Workshop', colorId: 2, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Seminario', colorId: 3, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Webinar', colorId: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Reunión', colorId: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fiesta', colorId: 6, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ceremonia', colorId: 7, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Charla', colorId: 8, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Networking', colorId: 9, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Taller', colorId: 10, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Concierto', colorId: 11, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Feria', colorId: 12, createdAt: new Date(), updatedAt: new Date() }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
}
