'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('UserEvents', [
      { user_id: 1, event_id: 1, status: 'completado', reasonPassed: 'Completed successfully', reasonIncompleted: null, createdAt: new Date(), updatedAt: new Date() },
      { user_id: 2, event_id: 2, status: 'pendiente', reasonPassed: null, reasonIncompleted: 'Pending due to schedule conflict', createdAt: new Date(), updatedAt: new Date() },
      { user_id: 3, event_id: 4, status: 'pasado', reasonPassed: 'Event was completed', reasonIncompleted: null, createdAt: new Date(), updatedAt: new Date() },
      { user_id: 4, event_id: 5, status: 'completado', reasonPassed: 'Attended and completed', reasonIncompleted: null, createdAt: new Date(), updatedAt: new Date() },
      { user_id: 5, event_id: 6, status: 'pendiente', reasonPassed: null, reasonIncompleted: 'Unable to attend due to personal reasons', createdAt: new Date(), updatedAt: new Date() },
      { user_id: 1, event_id: 7, status: 'pasado', reasonPassed: 'Event was held', reasonIncompleted: null, createdAt: new Date(), updatedAt: new Date() },
      { user_id: 2, event_id: 8, status: 'completado', reasonPassed: 'Event attended successfully', reasonIncompleted: null, createdAt: new Date(), updatedAt: new Date() },
      { user_id: 3, event_id: 10, status: 'pendiente', reasonPassed: null, reasonIncompleted: 'Scheduled conflict', createdAt: new Date(), updatedAt: new Date() },
      { user_id: 4, event_id: 11, status: 'pasado', reasonPassed: 'Completed event', reasonIncompleted: null, createdAt: new Date(), updatedAt: new Date() },
      { user_id: 5, event_id: 12, status: 'completado', reasonPassed: 'Successfully completed', reasonIncompleted: null, createdAt: new Date(), updatedAt: new Date() },
      { user_id: 1, event_id: 3, status: 'pendiente', reasonPassed: null, reasonIncompleted: 'Pending due to overlap', createdAt: new Date(), updatedAt: new Date() },
      { user_id: 2, event_id: 9, status: 'completado', reasonPassed: 'Event was attended', reasonIncompleted: null, createdAt: new Date(), updatedAt: new Date() }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserEvents', null, {})
  }
}
