'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Events', [
      { name: 'Event 1', description: null, startDate: new Date('2024-08-01T10:00:00Z'), endDate: new Date('2024-08-01T12:00:00Z'), location: 'Location 1', createdBy: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Event 2', description: 'Description for event 2', startDate: new Date('2024-08-02T14:00:00Z'), endDate: new Date('2024-08-02T16:00:00Z'), location: 'Location 2', createdBy: 2, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Event 3', description: 'Description for event 3', startDate: new Date('2024-08-03T09:00:00Z'), endDate: new Date('2024-08-03T11:00:00Z'), location: null, createdBy: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Event 4', description: 'Description for event 4', startDate: new Date('2024-08-04T10:00:00Z'), endDate: new Date('2024-08-04T12:00:00Z'), location: 'Location 4', createdBy: 3, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Event 5', description: 'Description for event 5', startDate: new Date('2024-08-05T14:00:00Z'), endDate: new Date('2024-08-05T16:00:00Z'), location: 'Location 5', createdBy: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Event 6', description: 'Description for event 6', startDate: new Date('2024-08-06T09:00:00Z'), endDate: new Date('2024-08-06T11:00:00Z'), location: 'Location 6', createdBy: 5, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Event 7', description: 'Description for event 7', startDate: new Date('2024-08-07T10:00:00Z'), endDate: new Date('2024-08-07T12:00:00Z'), location: 'Location 7', createdBy: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Event 8', description: 'Description for event 8', startDate: new Date('2024-08-08T14:00:00Z'), endDate: new Date('2024-08-08T16:00:00Z'), location: 'Location 8', createdBy: 2, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Event 9', description: 'Description for event 9', startDate: new Date('2024-08-09T09:00:00Z'), endDate: new Date('2024-08-09T11:00:00Z'), location: 'Location 9', createdBy: null, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Event 10', description: 'Description for event 10', startDate: new Date('2024-08-10T10:00:00Z'), endDate: new Date('2024-08-10T12:00:00Z'), location: 'Location 10', createdBy: 3, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Event 11', description: 'Description for event 11', startDate: new Date('2024-08-11T14:00:00Z'), endDate: new Date('2024-08-11T16:00:00Z'), location: 'Location 11', createdBy: 4, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Event 12', description: 'Description for event 12', startDate: new Date('2024-08-12T09:00:00Z'), endDate: new Date('2024-08-12T11:00:00Z'), location: 'Location 12', createdBy: 5, createdAt: new Date(), updatedAt: new Date() }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Events', null, {})
  }
}
