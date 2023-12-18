'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('StatisticDataDailies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Date: {
        type: Sequelize.DATE
      },
      Partner: {
        type: Sequelize.BIGINT
      },
      DailyPartner: {
        type: Sequelize.BIGINT
      },
      PartnerByCategory: {
        type: Sequelize.STRING
      },
      PostByDay: {
        type: Sequelize.STRING
      },
      PostByCategory: {
        type: Sequelize.STRING
      },
      BookingUser: {
        type: Sequelize.BIGINT
      },
      BookingUserByDay: {
        type: Sequelize.BIGINT
      },
      BookingByDay: {
        type: Sequelize.BIGINT
      },
      BookingSuccess: {
        type: Sequelize.BIGINT
      },
      BookingFail: {
        type: Sequelize.BIGINT
      },
      ValueOfBookingByDay: {
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
    await queryInterface.dropTable('StatisticDataDailies');
  }
};