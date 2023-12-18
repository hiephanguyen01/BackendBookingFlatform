"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StatisticData", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Month: {
        type: Sequelize.INTEGER,
      },
      Year: {
        type: Sequelize.INTEGER,
      },
      Partner: {
        type: Sequelize.BIGINT,
      },
      MonthPartner: {
        type: Sequelize.BIGINT,
      },
      PartnerByCategory: {
        type: Sequelize.STRING,
      },
      PostByMonth: {
        type: Sequelize.STRING,
      },
      PostByCategory: {
        type: Sequelize.STRING,
      },
      BookingUser: {
        type: Sequelize.BIGINT,
      },
      BookingUserByMonth: {
        type: Sequelize.BIGINT,
      },
      BookingUserByMonth: {
        type: Sequelize.BIGINT,
      },
      BookingByMonth: {
        type: Sequelize.BIGINT,
      },
      BookingSuccess: {
        type: Sequelize.BIGINT,
      },
      BookingFail: {
        type: Sequelize.BIGINT,
      },
      ValueOfBookingByMonth: {
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
    await queryInterface.dropTable("StatisticData");
  },
};
