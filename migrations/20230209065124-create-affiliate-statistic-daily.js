'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AffiliateStatisticDailies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AffiliateUserId: {
        type: Sequelize.INTEGER
      },
      Booking: {
        type: Sequelize.BIGINT
      },
      BookingValue: {
        type: Sequelize.BIGINT
      },
      Click: {
        type: Sequelize.BIGINT
      },
      Commission: {
        type: Sequelize.BIGINT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AffiliateStatisticDailies');
  }
};