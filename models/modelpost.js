"use strict";
const { Model } = require("sequelize");
const modelbooking = require("./modelbooking");
module.exports = (sequelize, DataTypes) => {
  class ModelPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      ModelRating,
      ModelPost_User,
      RegisterPartner,
      CartItem,
      ModelServicePackage,
      ModelBooking,
    }) {
      this.hasMany(ModelRating, {
        as: "ratings",
        foreignKey: "ModelPostId",
      });
      this.hasMany(ModelPost_User, {
        as: "UsersLiked",
        foreignKey: "ModelPostId",
      });
      // this.hasMany(ModelBooking, {
      //   foreignKey: "ModelId",
      // });
      this.belongsTo(RegisterPartner, {
        foreignKey: "TenantId",
      });
      this.hasMany(CartItem, {
        foreignKey: "ModelPostId",
      });
      this.hasMany(ModelServicePackage, {
        foreignKey: "ModelPostId",
        as: "ModelPost",
      });
    }
  }
  ModelPost.init(
    {
      TenantId: DataTypes.INTEGER,
      Name: DataTypes.STRING,
      Address: DataTypes.STRING,
      Price: DataTypes.DOUBLE,
      Sales: DataTypes.DOUBLE,
      BookingCount: DataTypes.INTEGER,
      Description: DataTypes.STRING,
      KeyWord: DataTypes.TEXT,
      KeyWordDescription: DataTypes.TEXT,
      BookingUserId: DataTypes.INTEGER,
      CreationTime: { type: DataTypes.DATE, defaultValue: new Date() },
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      DeleterUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
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
      HourCloseDefault: DataTypes.INTEGER,
      HourOpenDefault: DataTypes.INTEGER,
      MinutesCloseDefault: DataTypes.INTEGER,
      IsHotDeal: DataTypes.BOOLEAN,
      MinutesOpenDefault: DataTypes.INTEGER,
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
      timestamps: false,
      modelName: "ModelPost",
    }
  );
  return ModelPost;
};
