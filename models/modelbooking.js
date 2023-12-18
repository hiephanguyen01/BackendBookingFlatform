"use strict";
const { Model } = require("sequelize");
const modelservicepackage = require("./modelservicepackage");
module.exports = (sequelize, DataTypes) => {
  class ModelBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ BookingUser, ModelServicePackage, AffiliateUser }) {
      this.belongsTo(BookingUser, {
        foreignKey: "BookingUserId",
        as: "user",
      });
      this.belongsTo(AffiliateUser, { foreignKey: "affiliateUserId" });
      this.belongsTo(ModelServicePackage, {
        foreignKey: "ModelServiceId",
        as: "Bookings",
      });
    }
  }
  ModelBooking.init(
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
      ModelId: DataTypes.INTEGER,
      ModelServiceId: DataTypes.INTEGER,
      BookingUserId: DataTypes.INTEGER,
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
      DepositValue: DataTypes.INTEGER,
      DeletedNote: DataTypes.STRING,
      BankRefund: DataTypes.STRING,
      numberOfTime: DataTypes.STRING,
      IsRefund: DataTypes.BOOLEAN,
      PaymentTypeOnline: DataTypes.TINYINT,
      Commission: DataTypes.BIGINT,
      Category: DataTypes.INTEGER,
      BookingValueBeforeDiscount: DataTypes.BIGINT,
      AffiliateCommission: DataTypes.BIGINT,
      accountUser: DataTypes.STRING,
      bank: DataTypes.STRING,
      bankAccount: DataTypes.STRING,
      Commission: DataTypes.BIGINT,
      AffiliateUserId: DataTypes.INTEGER,
      accountUser: DataTypes.STRING,
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
      modelName: "ModelBooking",
    }
  );
  return ModelBooking;
};
