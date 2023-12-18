"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PhotographerBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      BookingUser,
      PhotographerServicePackage,
      AffiliateProduct,
      AffiliateUser
    }) {
      PhotographerBooking.belongsTo(BookingUser, {
        foreignKey: "BookingUserId",
        as: "user",
      });
      PhotographerBooking.belongsTo(PhotographerServicePackage, {
        foreignKey: "PhotographerServicePackageId",
      });

      PhotographerBooking.hasMany(AffiliateProduct, { foreignKey: "orderId" });
      this.belongsTo(AffiliateUser, { foreignKey: "affiliateUserId" });
    }
  }
  PhotographerBooking.init(
    {
      BookingUserId: DataTypes.INTEGER,
      IdentifyCode: DataTypes.STRING,
      TenantId: DataTypes.STRING,
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
      PhotographerServicePackageId: DataTypes.INTEGER,
      BookingUserId: DataTypes.INTEGER,
      PromoCodeId: DataTypes.INTEGER,
      CreationTime: DataTypes.DATE,
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      DeletedUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
      EvidenceImage: DataTypes.STRING,
      IsPayDeposit: DataTypes.BOOLEAN,
      BookingStatus: DataTypes.INTEGER,
      PaymentStatus: DataTypes.INTEGER,
      PaymentTypeOnline: DataTypes.BOOLEAN,
      Commission: DataTypes.BIGINT,
      BookingValue: DataTypes.BIGINT,
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
      CancelPriceByDate: DataTypes.INTEGER,
      CancelPriceByHour: DataTypes.INTEGER,
      AbsentPriceByHour: DataTypes.INTEGER,
      AbsentPriceByDate: DataTypes.INTEGER,
      DepositByDate: DataTypes.INTEGER,
      DepositByHour: DataTypes.INTEGER,
      FreeCancelByDate: DataTypes.STRING,
      FreeCancelByHour: DataTypes.STRING,
      CommissionPercent:DataTypes.FLOAT,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "PhotographerBooking",
    }
  );
  return PhotographerBooking;
};
