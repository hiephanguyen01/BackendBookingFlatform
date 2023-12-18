"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PhotographerBookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      IdentifyCode: {
        type: Sequelize.STRING,
      },
      TenantId: {
        type: Sequelize.STRING,
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
      PhotographerServicePackageId: {
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
      DeletedUserId: {
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
      PaymentStatus: {
        type: Sequelize.INTEGER,
      },
      PaymentTypeOnline: {
        type: Sequelize.BOOLEAN,
      },
      Commission: {
        type: Sequelize.BIGINT,
      },
      BookingValue: {
        type: Sequelize.BIGINT,
      },
      BookingValueBeforeDiscount: {
        type: Sequelize.BIGINT,
      },
      IsRefund: {
        type: Sequelize.BOOLEAN,
      },
      DepositValue: {
        type: Sequelize.INTEGER,
      },
      DeletedNote: {
        type: Sequelize.STRING,
      },
      numberOfTime: {
        type: Sequelize.STRING,
      },
      AffiliateUserId: { type: Sequelize.INTEGER },
      CancelPrice: { type: Sequelize.INTEGER },
      Category: { type: Sequelize.INTEGER },
      AffiliateCommission: { type: Sequelize.BIGINT },
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
    await queryInterface.dropTable("PhotographerBookings");
  },
};
