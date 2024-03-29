"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MakeupServicePackage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ MakeUpBooking, MakeupPost, CartItem }) {
      // define association here
      this.hasMany(MakeUpBooking, {
        foreignKey: "MakeupServicePackageId",
        as: "Bookings",
      });

      this.belongsTo(MakeupPost, {
        foreignKey: "MakeupPostId",
        as: "MakeupPost",
      });

      this.hasMany(CartItem, {
        foreignKey: "ServiceId",
      });
    }
  }
  MakeupServicePackage.init(
    {
      TenantId: DataTypes.INTEGER,
      Name: DataTypes.STRING,
      PriceByHour: DataTypes.DOUBLE,
      PriceByDate: DataTypes.DOUBLE,
      Sales: DataTypes.DOUBLE,
      PriceNote: DataTypes.STRING,
      Image1: DataTypes.STRING,
      Image2: DataTypes.STRING,
      Image3: DataTypes.STRING,
      Image4: DataTypes.STRING,
      Image5: DataTypes.STRING,
      Image6: DataTypes.STRING,
      Image7: DataTypes.STRING,
      Image8: DataTypes.STRING,
      Image9: DataTypes.STRING,
      Image10: DataTypes.STRING,
      Image11: DataTypes.STRING,
      Image12: DataTypes.STRING,
      Image13: DataTypes.STRING,
      Image14: DataTypes.STRING,
      Image15: DataTypes.STRING,
      Image16: DataTypes.STRING,
      Image17: DataTypes.STRING,
      Image18: DataTypes.STRING,
      Image19: DataTypes.STRING,
      Image20: DataTypes.STRING,
      Description: DataTypes.STRING,
      MakeupPostId: DataTypes.INTEGER,
      CreationTime: { type: DataTypes.DATE, defaultValue: new Date() },
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      DeleterUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
      AffiliateCommissionByHour: DataTypes.FLOAT,
      AffiliateCommissionByDate: DataTypes.FLOAT,
      Deposit: DataTypes.DOUBLE,
      Surcharge: DataTypes.DOUBLE,
      CancelPriceByDate: DataTypes.INTEGER,
      CancelPriceByHour: DataTypes.INTEGER,
      AbsentPriceByDate: DataTypes.INTEGER,
      AbsentPriceByHour: DataTypes.INTEGER,
      DepositPaymentTypeByDate: DataTypes.INTEGER,
      DepositPaymentTypeByHour: DataTypes.INTEGER,
      DepositByDate: DataTypes.INTEGER,
      DepositByHour: DataTypes.INTEGER,
      FreeCancelByDate: DataTypes.STRING,
      FreeCancelByHour: DataTypes.STRING,
      CancelLostDepositPercent: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      sequelize,
      modelName: "MakeupServicePackage",
    }
  );
  return MakeupServicePackage;
};
