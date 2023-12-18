"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("StudioBookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      BookingUserId: {
        type: Sequelize.INTEGER,
        references: {
          model: "BookingUsers",
          key: "id",
        },
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
      StudioRoomId: {
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
      PaymentStatus: {
        type: Sequelize.INTEGER,
      },
      PaymentTypeOnline: {
        type: Sequelize.BOOLEAN,
      },
      Commission: {
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

      HasLamp: { type: Sequelize.BOOLEAN },
      LampDescription: { type: Sequelize.STRING },
      HasBackground: { type: Sequelize.BOOLEAN },
      BackgroundDescription: { type: Sequelize.STRING },
      HasTable: { type: Sequelize.BOOLEAN },
      HasChair: { type: Sequelize.BOOLEAN },
      HasSofa: { type: Sequelize.BOOLEAN },
      HasFlower: { type: Sequelize.BOOLEAN },
      HasOtherDevice: { type: Sequelize.BOOLEAN },
      OtherDeviceDescription: { type: Sequelize.STRING },
      HasFan: { type: Sequelize.BOOLEAN },
      HasAirConditioner: { type: Sequelize.BOOLEAN },
      HasDressingRoom: { type: Sequelize.BOOLEAN },
      HasWC: { type: Sequelize.BOOLEAN },
      HasCamera: { type: Sequelize.BOOLEAN },
      HasWifi: { type: Sequelize.BOOLEAN },
      HasMotorBikeParking: { type: Sequelize.BOOLEAN },
      HasCarParking: { type: Sequelize.BOOLEAN },
      HasSupporter: { type: Sequelize.BOOLEAN },
      Width: { type: Sequelize.DOUBLE },
      Length: { type: Sequelize.DOUBLE },
      Height: { type: Sequelize.DOUBLE },
      Area: { type: Sequelize.STRING },
      MaximumCustomer: { type: Sequelize.INTEGER },
      Surcharge: { type: Sequelize.DOUBLE },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("StudioBookings");
  },
};
