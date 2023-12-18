"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ScheduleAndPriceModelByDates", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      PriceByDate: {
        type: Sequelize.DOUBLE,
      },
      PriceByHour: {
        type: Sequelize.DOUBLE,
      },
      DepositByDate: {
        type: Sequelize.INTEGER,
      },
      DepositPaymentTypeByDate: {
        type: Sequelize.INTEGER,
      },
      DepositByHour: {
        type: Sequelize.INTEGER,
      },
      DepositPaymentTypeByHour: {
        type: Sequelize.INTEGER,
      },
      PaymentByDate: {
        type: Sequelize.BOOLEAN,
      },
      PaymentByHour: {
        type: Sequelize.BOOLEAN,
      },
      CancelPriceByDate: {
        type: Sequelize.INTEGER,
      },
      CancelPriceByHour: {
        type: Sequelize.INTEGER,
      },
      AbsentPriceByDate: {
        type: Sequelize.INTEGER,
      },
      AbsentPriceByHour: {
        type: Sequelize.INTEGER,
      },
      FreeCancelByDate: {
        type: Sequelize.STRING,
      },
      FreeCancelByHour: {
        type: Sequelize.STRING,
      },
      Open: {
        type: Sequelize.BOOLEAN,
      },
      OpenMorning: {
        type: Sequelize.BOOLEAN,
      },
      OpenAfternoon: {
        type: Sequelize.BOOLEAN,
      },
      Date: {
        type: Sequelize.STRING,
      },
      ServiceId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      TenantId: {
        type: Sequelize.INTEGER,
      },
      OpenByDate: {
        type: Sequelize.BOOLEAN,
      },
      OpenByHour: {
        type: Sequelize.BOOLEAN,
      },
      DateTime: {
        type: Sequelize.DATE,
      },
      MorningOpenHour: {
        type: Sequelize.INTEGER,
      },
      MorningOpenMinutes: {
        type: Sequelize.INTEGER,
      },
      MorningCloseHour: {
        type: Sequelize.INTEGER,
      },
      MorningCloseMinutes: {
        type: Sequelize.INTEGER,
      },
      AfternoonOpenHour: {
        type: Sequelize.INTEGER,
      },
      AfternoonOpenMinutes: {
        type: Sequelize.INTEGER,
      },
      AfternoonCloseHour: {
        type: Sequelize.INTEGER,
      },
      AfternoonCloseMinutes: {
        type: Sequelize.INTEGER,
      },
      BreakTimeHour: {
        type: Sequelize.INTEGER,
      },
      BreakTimeMinutes: {
        type: Sequelize.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ScheduleAndPriceModelByDates");
  },
};
