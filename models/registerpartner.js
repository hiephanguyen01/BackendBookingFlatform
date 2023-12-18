"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RegisterPartner extends Model {
    static associate({
      IdentifyImage,
      ParnerComment,
      Bank,
      StudioRoom,
      SecurityQuestion,
    }) {
      RegisterPartner.hasMany(IdentifyImage, {
        as: "IdentifyLicenses",
        foreignKey: "PartnerId",
      });
      RegisterPartner.hasMany(ParnerComment, {
        foreignKey: "PartnerId",
      });
      this.hasMany(StudioRoom, {
        foreignKey: "TenantId",
      });
      this.belongsTo(Bank);
      this.belongsTo(SecurityQuestion, {
        as: "SecurityQuestion1",
        foreignKey: "SecurityQuestion1Id",
      });
      this.belongsTo(SecurityQuestion, {
        as: "SecurityQuestion2",
        foreignKey: "SecurityQuestion2Id",
      });
      this.belongsTo(SecurityQuestion, {
        as: "SecurityQuestion3",
        foreignKey: "SecurityQuestion3Id",
      });
    }
  }
  RegisterPartner.init(
    {
      TenantId: DataTypes.INTEGER,
      PartnerName: DataTypes.STRING,
      RepresentativeName: DataTypes.STRING,
      Phone: DataTypes.STRING,
      OtherPhone: DataTypes.STRING,
      Email: DataTypes.STRING,
      ReEmail: DataTypes.STRING,
      BusinessRegistrationLicenseNumber: DataTypes.STRING,
      Address: DataTypes.STRING,
      BankBranchName: DataTypes.STRING,
      BankAccount: DataTypes.STRING,
      BankAccountOwnerName: DataTypes.STRING,
      CreationTime: DataTypes.DATE,
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      DeleterUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
      BusinessType: DataTypes.STRING,
      PersonalIdentity: DataTypes.STRING,
      ProvinceId: DataTypes.INTEGER,
      Note: DataTypes.STRING,
      PostCount: DataTypes.INTEGER,
      PaymentTypeOnline: DataTypes.TINYINT,
      CommissionRate: DataTypes.FLOAT,
      ImageGPKD1: DataTypes.STRING,
      ImageGPKD2: DataTypes.STRING,
      ImageCCCD1: DataTypes.STRING,
      ImageCCCD2: DataTypes.STRING,
      CompanyName: DataTypes.STRING,
      HashPassword: DataTypes.STRING,
      SecurityQuestion1Answer: DataTypes.STRING,
      SecurityQuestion2Answer: DataTypes.STRING,
      SecurityQuestion3Answer: DataTypes.STRING,
      verifyCode: DataTypes.STRING,
      tokenEmail: DataTypes.STRING,
      IsVerifiedEmail: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "RegisterPartner",
    }
  );
  return RegisterPartner;
};
