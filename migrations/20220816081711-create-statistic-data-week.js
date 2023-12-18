"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StatisticDataWeeks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      From: {
        type: Sequelize.DATE,
      },
      To: {
        type: Sequelize.DATE,
      },
      Partner: {
        type: Sequelize.BIGINT,
      },
      WeekPartner: {
        type: Sequelize.BIGINT,
      },
      PartnerByCategory: {
        type: Sequelize.STRING,
      },
      PostByWeek: {
        type: Sequelize.STRING,
      },
      PostByCategory: {
        type: Sequelize.STRING,
      },
      BookingUser: {
        type: Sequelize.BIGINT,
      },
      BookingUserByWeek: {
        type: Sequelize.BIGINT,
      },
      BookingByWeek: {
        type: Sequelize.BIGINT,
      },
      BookingSuccess: {
        type: Sequelize.BIGINT,
      },
      BookingFail: {
        type: Sequelize.BIGINT,
      },
      ValueOfBookingByWeek: {
        type: Sequelize.BIGINT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("StatisticDataWeeks");
  },
};
