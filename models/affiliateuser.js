"use strict";
const { Model } = require("sequelize");
const photographerbooking = require("./photographerbooking");
module.exports = (sequelize, DataTypes) => {
  class AffiliateUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      AffiliateProduct,
      StudioBooking,
      PhotographerBooking,
      MakeUpBooking,
      ModelBooking,
    }) {
      // define association here
      this.hasMany(AffiliateProduct, { foreignKey: "affiliateUserId" });
      this.hasMany(StudioBooking, { foreignKey: "affiliateUserId" });
      this.hasMany(PhotographerBooking, { foreignKey: "affiliateUserId" });
      this.hasMany(MakeUpBooking, { foreignKey: "affiliateUserId" });
      this.hasMany(ModelBooking, { foreignKey: "affiliateUserId" });
    }
  }
  AffiliateUser.init(
    {
      isPersonal: DataTypes.BOOLEAN,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      companyAddress: DataTypes.STRING,
      address: DataTypes.STRING,
      links: DataTypes.TEXT("long"),
      companyName: DataTypes.STRING,
      taxCode: DataTypes.STRING,
      CCCD1: DataTypes.STRING,
      CCCD2: DataTypes.STRING,
      addressPermanent: DataTypes.STRING,
      bankAccount: DataTypes.STRING,
      bankAccountOwner: DataTypes.STRING,
      bankName: DataTypes.STRING,
      idNumber: DataTypes.STRING,
      licenseDate: DataTypes.DATE,
      phoneInfo: DataTypes.STRING,
      representName: DataTypes.STRING,
      isActivate: DataTypes.BOOLEAN,
      image: DataTypes.STRING,
      facebookId: DataTypes.STRING,
      facebookToken: DataTypes.STRING,
      facebookFirstname: DataTypes.STRING,
      facebookLastname: DataTypes.STRING,
      facebookEmail: DataTypes.STRING,
      facebookPicture: DataTypes.STRING,
      googleName: DataTypes.STRING,
      googleEmail: DataTypes.STRING,
      googlePicture: DataTypes.STRING,
      isDelete: DataTypes.BOOLEAN,
      note: DataTypes.STRING,
      isActivateEmail: DataTypes.BOOLEAN,
      isActivePhone: DataTypes.BOOLEAN,
      isRequired: DataTypes.BOOLEAN,
      successCount: DataTypes.INTEGER,
      password: DataTypes.STRING,
      salt: DataTypes.STRING,
      verifyCode: DataTypes.STRING,
      tokenEmail: DataTypes.STRING,
      CreationTime: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      modelName: "AffiliateUser",
    }
  );
  return AffiliateUser;
};
