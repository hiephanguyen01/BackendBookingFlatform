"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ClothesBooking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ClothesPost, BookingUser, SaleCode }) {
      // define association here
      this.belongsTo(ClothesPost, { foreignKey: "ClothesId" });
      this.belongsTo(BookingUser, {
        foreignKey: "BookingUserId",
        as: "user",
      });
      this.belongsTo(SaleCode, {
        foreignKey: "PromoCodeId",
      });
    }
  }
  ClothesBooking.init(
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
      ClothesId: DataTypes.INTEGER,
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
      IsRefund: DataTypes.BOOLEAN,
      PaymentTypeOnline: DataTypes.TINYINT,
      Commission: DataTypes.BIGINT,
      BookingValueBeforeDiscount: DataTypes.BIGINT,
      Size: DataTypes.STRING,
      Color: DataTypes.STRING,
      Amount: DataTypes.INTEGER,
      CommissionPercent:DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "ClothesBooking",
    }
  );
  return ClothesBooking;
};
