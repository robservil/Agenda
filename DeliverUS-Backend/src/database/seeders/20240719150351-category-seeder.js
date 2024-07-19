'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      { name: 'Conferencia', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Workshop', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Seminario', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Webinar', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Reunión', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Fiesta', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ceremonia', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Charla', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Networking', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Taller', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Concierto', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Feria', createdAt: new Date(), updatedAt: new Date() }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {})
  }
}
