"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ModelBookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      TenantId: {
        type: Sequelize.INTEGER,
      },
      OrderByTime: {
        type: Sequelize.BOOLEAN,
      },
      OrderByTimeFrom: {
        type: Sequelize.DATE,
      },
      OrderByTimeTo: {
        type: Sequelize.DATE,
      },
      OrderByDateFrom: {
        type: Sequelize.DATE,
      },
      OrderByDateTo: {
        type: Sequelize.DATE,
      },
      PaymentType: {
        type: Sequelize.STRING,
      },
      OrderNote: {
        type: Sequelize.STRING,
      },
      BookingUserName: {
        type: Sequelize.STRING,
      },
      BookingPhone: {
        type: Sequelize.STRING,
      },
      BookingEmail: {
        type: Sequelize.STRING,
      },
      ModelId: {
        type: Sequelize.INTEGER,
      },
      BookingUserId: {
        type: Sequelize.INTEGER,
      },
      PromoCodeId: {
        type: Sequelize.INTEGER,
      },
      CreationTime: {
        type: Sequelize.DATE,
      },
      CreatorUserId: {
        type: Sequelize.BIGINT,
      },
      LastModificationTime: {
        type: Sequelize.DATE,
      },
      LastModifierUserId: {
        type: Sequelize.BIGINT,
      },
      IsDeleted: {
        type: Sequelize.BOOLEAN,
      },
      DeleterUserId: {
        type: Sequelize.BIGINT,
      },
      DeletionTime: {
        type: Sequelize.DATE,
      },
      EvidenceImage: {
        type: Sequelize.STRING,
      },
      IsPayDeposit: {
        type: Sequelize.BOOLEAN,
      },
      BookingStatus: {
        type: Sequelize.INTEGER,
      },
      BookingValue: {
        type: Sequelize.BIGINT,
      },
      PaymentStatus: {
        type: Sequelize.INTEGER,
      },
      DepositValue: {
        type: Sequelize.INTEGER,
      },
      DeletedNote: {
        type: Sequelize.STRING,
      },
      BankRefund: {
        type: Sequelize.STRING,
      },
      IsRefund: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      PaymentTypeOnline: { type: Sequelize.BOOLEAN },
      BookingValueBeforeDiscount: { type: Sequelize.BIGINT },
      Commission: { type: Sequelize.BIGINT },
      AffiliateCommission: { type: Sequelize.BIGINT },
      Category: { type: Sequelize.INTEGER },
      AffiliateUserId: { type: Sequelize.INTEGER },
      numberOfTime: { type: Sequelize.STRING },
      accountUser: { type: Sequelize.STRING },
      bank: { type: Sequelize.STRING },
      bankAccount: { type: Sequelize.STRING },
      CancelPriceByDate: { type: Sequelize.INTEGER },
      CancelPriceByHour: { type: Sequelize.INTEGER },
      AbsentPriceByHour: { type: Sequelize.INTEGER },
      AbsentPriceByDate: { type: Sequelize.INTEGER },
      DepositByDate: { type: Sequelize.INTEGER },
      DepositByHour: { type: Sequelize.INTEGER },
      FreeCancelByDate: { type: Sequelize.STRING },
      FreeCancelByHour: { type: Sequelize.STRING },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ModelBookings");
  },
};
