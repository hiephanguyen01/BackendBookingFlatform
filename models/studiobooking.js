"use strict";
const { database } = require("firebase-admin");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudioBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      BookingUser,
      StudioRoom,
      SaleCode,
      AffiliateProduct,
      RegisterPartner,
      AffiliateUser,
    }) {
      StudioBooking.belongsTo(BookingUser, {
        foreignKey: "BookingUserId",
        as: "user",
      });
      StudioBooking.belongsTo(StudioRoom, { foreignKey: "StudioRoomId" });
      StudioBooking.belongsTo(SaleCode, {
        foreignKey: "PromoCodeId",
      });
      this.hasMany(AffiliateProduct, { foreignKey: "orderId" });
      this.belongsTo(RegisterPartner, {
        foreignKey: "TenantId",
      });
      this.belongsTo(AffiliateUser, { foreignKey: "affiliateUserId" });
    }
  }
  StudioBooking.init(
    {
      TenantId: DataTypes.INTEGER,
      IdentifyCode: DataTypes.STRING,
      OrderByTime: DataTypes.BOOLEAN,
      OrderByTimeFrom: DataTypes.DATE,
      OrderByTimeTo: DataTypes.DATE,
      OrderByDateFrom: DataTypes.DATE,
      OrderByDateTo: DataTypes.DATE,
      PaymentType: DataTypes.STRING,
      OrderNote: DataTypes.STRING,
      BookingUserName: DataTypes.STRING,
      BookingPhone: DataTypes.STRING,
      BookingEmail: DataTypes.STRING,
      StudioRoomId: DataTypes.INTEGER,
      PromoCodeId: DataTypes.INTEGER,
      CreationTime: DataTypes.DATE,
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      DeleterUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
      EvidenceImage: DataTypes.STRING,
      IsPayDeposit: DataTypes.BOOLEAN,
      BookingStatus: DataTypes.INTEGER,
      BookingValue: DataTypes.BIGINT,
      PaymentStatus: DataTypes.INTEGER,
      BookingUserId: DataTypes.INTEGER,
      PaymentTypeOnline: DataTypes.TINYINT,
      Commission: DataTypes.BIGINT,
      BookingValueBeforeDiscount: DataTypes.BIGINT,
      IsRefund: DataTypes.BOOLEAN,
      DepositValue: DataTypes.INTEGER,
      DeletedNote: DataTypes.STRING,
      numberOfTime: DataTypes.STRING,
      AffiliateUserId: DataTypes.INTEGER,
      CancelPrice: DataTypes.INTEGER,
      Category: DataTypes.INTEGER,
      AffiliateCommission: DataTypes.BIGINT,
      accountUser: DataTypes.STRING,
      bank: DataTypes.STRING,
      bankAccount: DataTypes.STRING,
      HasLamp: DataTypes.BOOLEAN,
      LampDescription: DataTypes.STRING,
      HasBackground: DataTypes.BOOLEAN,
      BackgroundDescription: DataTypes.STRING,
      HasTable: DataTypes.BOOLEAN,
      HasChair: DataTypes.BOOLEAN,
      HasSofa: DataTypes.BOOLEAN,
      HasFlower: DataTypes.BOOLEAN,
      HasOtherDevice: DataTypes.BOOLEAN,
      OtherDeviceDescription: DataTypes.STRING,
      HasFan: DataTypes.BOOLEAN,
      HasAirConditioner: DataTypes.BOOLEAN,
      HasDressingRoom: DataTypes.BOOLEAN,
      HasWC: DataTypes.BOOLEAN,
      HasCamera: DataTypes.BOOLEAN,
      HasWifi: DataTypes.BOOLEAN,
      HasMotorBikeParking: DataTypes.BOOLEAN,
      HasCarParking: DataTypes.BOOLEAN,
      HasSupporter: DataTypes.BOOLEAN,
      Width: DataTypes.DOUBLE,
      Length: DataTypes.DOUBLE,
      Height: DataTypes.DOUBLE,
      Area: DataTypes.STRING,
      MaximumCustomer: DataTypes.INTEGER,
      Surcharge: DataTypes.DOUBLE,
      CancelPriceByDate: DataTypes.INTEGER,
      CancelPriceByHour: DataTypes.INTEGER,
      AbsentPriceByHour: DataTypes.INTEGER,
      AbsentPriceByDate: DataTypes.INTEGER,
      DepositByDate: DataTypes.INTEGER,
      DepositByHour: DataTypes.INTEGER,
      FreeCancelByDate: DataTypes.STRING,
      FreeCancelByHour: DataTypes.STRING,
      CommissionPercent: DataTypes.FLOAT,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "StudioBooking",
    }
  );
  return StudioBooking;
};
