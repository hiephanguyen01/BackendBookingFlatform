"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MakeupPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      MakeupRating,
      MakeupPost_User,
      RegisterPartner,
      CartItem,
    }) {
      this.hasMany(MakeupRating, {
        as: "ratings",
        foreignKey: "MakeupPostId",
      });
      this.hasMany(MakeupPost_User, {
        as: "UsersLiked",
        foreignKey: "MakeupPostId",
      });
      this.belongsTo(RegisterPartner, {
        foreignKey: "TenantId",
      });
      this.hasMany(CartItem, {
        foreignKey: "MakeupPostId",
      });
    }
  }
  MakeupPost.init(
    {
      TenantId: DataTypes.INTEGER,
      Name: DataTypes.STRING,
      Description: DataTypes.STRING,
      KeyWord: DataTypes.TEXT,
      KeyWordDescription: DataTypes.TEXT,
      BookingCount: DataTypes.INTEGER,
      Price: DataTypes.DOUBLE,
      Sales: DataTypes.DOUBLE,
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
      IsBestSell: DataTypes.BOOLEAN,
      IsNewest: DataTypes.BOOLEAN,
      BookingUserId: DataTypes.INTEGER,
      CreationTime: { type: DataTypes.DATE, defaultValue: new Date() },
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      DeleterUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
      Address: DataTypes.STRING,
      HourCloseDefault: DataTypes.INTEGER,
      HourOpenDefault: DataTypes.INTEGER,
      MinutesCloseDefault: DataTypes.INTEGER,
      MinutesOpenDefault: DataTypes.INTEGER,
      IsBestSell: DataTypes.BOOLEAN,
      IsNewest: DataTypes.BOOLEAN,
      IsHotDeal: DataTypes.BOOLEAN,
      IsVisible: DataTypes.BOOLEAN,
      Note: DataTypes.STRING,
      TotalRate: DataTypes.DOUBLE,
      NumberOfRating: DataTypes.INTEGER,
      OpenMorningMinutes: DataTypes.INTEGER,
      OpenAfternoonHour: DataTypes.INTEGER,
      OpenAfternoonMinutes: DataTypes.INTEGER,
      OpenMorningHour: DataTypes.INTEGER,
      AffiliateCommissionByHour: DataTypes.FLOAT,
      AffiliateCommissionByDate: DataTypes.FLOAT,

      // CloseAfternoonHour:DataTypes.INTEGER,
      // CloseAfternoonMinutes:DataTypes.INTEGER,
      // CloseMorningHour:DataTypes.INTEGER,
      // CloseMorningMinutes:DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MakeupPost",
      timestamps: false,
    }
  );
  return MakeupPost;
};
