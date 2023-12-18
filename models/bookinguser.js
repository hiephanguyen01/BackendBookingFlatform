"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BookingUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      StudioBooking,
      StudioRating,
      PhotographerBooking,
      MakeUpBooking,
      PhotographerRating,
      ModelPost_User,
      SavedPost,
      PromoteCode_UserSave,
      Comment,
      Post,
      Love,
      ClothesBooking,
      Cart,
    }) {
      // define association here
      this.hasMany(Post, {
        foreignKey: "BookingUserId",
        // as: "bookings",
      });
      this.hasMany(Love, {
        foreignKey: "UserId",
      });
      this.hasMany(StudioBooking, {
        foreignKey: "BookingUserId",
        as: "bookings",
      });
      this.hasMany(PhotographerBooking, {
        foreignKey: "BookingUserId",
        as: "bookingsPhoto",
      });
      this.hasMany(MakeUpBooking, {
        foreignKey: "BookingUserId",
        as: "bookingsMakeup",
      });
      this.hasMany(ClothesBooking, {
        foreignKey: "BookingUserId",
        as: "bookingsClothes",
      });
      this.hasMany(StudioRating, {
        as: "ratings",
        foreignKey: "BookingUserId",
      });
      this.hasMany(PhotographerRating, {
        foreignKey: "BookingUserId",
      });
      this.hasMany(ModelPost_User, {
        foreignKey: "UserId",
      });
      this.hasMany(SavedPost, {
        foreignKey: "UserId",
      });
      this.hasMany(PromoteCode_UserSave, {
        foreignKey: "BookingUserId",
      });
      this.hasMany(Comment, {
        as: "comments",
        foreignKey: "BookingUserId",
      });
      this.hasOne(Cart, {
        foreignKey: "BookingUserId",
      });
    }
  }
  BookingUser.init(
    {
      Email: { type: DataTypes.STRING, unique: true },
      Username: { type: DataTypes.STRING, unique: true },
      Phone: { type: DataTypes.STRING, unique: true },
      HashPassword: DataTypes.STRING,
      Salt: DataTypes.STRING,
      Fullname: DataTypes.STRING,
      CreatedDate: DataTypes.DATE,
      UpdatedDate: DataTypes.DATE,
      Status: DataTypes.INTEGER,
      UpdatedBy: DataTypes.INTEGER,
      Image: DataTypes.STRING,
      FacebookId: DataTypes.STRING,
      GoogleEmail: DataTypes.STRING,
      FacebookToken: DataTypes.STRING,
      FacebookFirstname: DataTypes.STRING,
      FacebookLastname: DataTypes.STRING,
      FacebookEmail: DataTypes.STRING,
      FacebookPicture: DataTypes.STRING,
      GoogleName: DataTypes.STRING,
      CreationTime: DataTypes.DATE,
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      DeleterUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
      AppleEmail: DataTypes.STRING,
      AppleFamilyName: DataTypes.STRING,
      AppleGivenName: DataTypes.STRING,
      AppleUserIdentifier: DataTypes.STRING,
      TenantId: DataTypes.INTEGER,
      UserTypeId: DataTypes.INTEGER,
      ProvinceId: DataTypes.INTEGER,
      Note: DataTypes.STRING,
      VerifyCode: DataTypes.STRING,
      IsActiveEmail: DataTypes.BOOLEAN,
      TokenEmail: DataTypes.STRING,
      ZaloId: DataTypes.STRING,
      ZaloPicture: DataTypes.STRING,
      ZaloName: DataTypes.STRING,
      BookingCount: DataTypes.INTEGER,
      CartId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "BookingUser",
      timestamps: false,
    }
  );
  return BookingUser;
};
