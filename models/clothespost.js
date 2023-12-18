"use strict";
const { Model } = require("sequelize");
const cartitem = require("./cartitem");
module.exports = (sequelize, DataTypes) => {
  class ClothesPosts extends Model {
    static associate({
      ClothesRating,
      ClothesPost_User,
      ClothesBooking,
      Shop,
      GroupMap,
      CartItem,
      RegisterPartner,
    }) {
      this.hasMany(ClothesRating, {
        as: "ratings",
        foreignKey: "ClothesPostId",
      });

      this.hasMany(ClothesPost_User, {
        as: "UsersLiked",
        foreignKey: "ClothesPostId",
      });

      this.hasMany(ClothesBooking, {
        foreignKey: "ClothesId",
        as: "Bookings",
      });

      this.hasMany(CartItem, { foreignKey: "ClothesPostId" });

      this.belongsTo(Shop, {
        foreignKey: "ShopId",
      });

      this.hasMany(GroupMap, {
        foreignKey: "ClothesPostId",
      });

      this.belongsTo(RegisterPartner, {
        foreignKey: "TenantId",
      });
    }
  }
  ClothesPosts.init(
    {
      TenantId: DataTypes.INTEGER,
      Name: DataTypes.STRING,
      Description: DataTypes.STRING,
      KeyWord: DataTypes.TEXT,
      KeyWordDescription: DataTypes.TEXT,
      BookingCount: DataTypes.INTEGER,
      PriceByHour: DataTypes.DOUBLE,
      PriceByDate: DataTypes.DOUBLE,
      SalesByHour: DataTypes.DOUBLE,
      SalesByDate: DataTypes.DOUBLE,
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
      IsPopular: DataTypes.BOOLEAN,
      IsBestSell: DataTypes.BOOLEAN,
      IsNewest: DataTypes.BOOLEAN,
      ShopId: DataTypes.INTEGER,
      CreationTime: DataTypes.DATE,
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      IsVisible: DataTypes.BOOLEAN,
      DeleterUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
      Address: DataTypes.STRING,
      Note: DataTypes.STRING,
      TotalRate: DataTypes.DOUBLE,
      NumberOfRating: DataTypes.INTEGER,
      AffiliateCommissionByHour: DataTypes.FLOAT,
      Open: DataTypes.BOOLEAN,
      AffiliateCommissionByDate: DataTypes.FLOAT,
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
      DepositPaymentTypeByDate: DataTypes.INTEGER,
      DepositPaymentTypeByHour: DataTypes.INTEGER,
      // CloseAfternoonHour:DataTypes.INTEGER,
      // CloseAfternoonMinutes:DataTypes.INTEGER,
      // CloseMorningHour:DataTypes.INTEGER,
      // CloseMorningMinutes:DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ClothesPost",
      timestamps: false,
    }
  );
  return ClothesPosts;
};
