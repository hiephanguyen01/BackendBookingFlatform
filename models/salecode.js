"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SaleCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ PromoteCode_Partner, StudioBooking, ClothesBooking }) {
      this.hasMany(PromoteCode_Partner, {
        foreignKey: "PromoteCodeId",
      });
      this.hasMany(StudioBooking, {
        foreignKey: "PromoCodeId",
      });
      this.hasMany(ClothesBooking, {
        foreignKey: "PromoCodeId",
      });
    }
  }
  SaleCode.init(
    {
      SaleCode: DataTypes.STRING,
      NoOfCode: DataTypes.INTEGER,
      NoOfJoin: DataTypes.INTEGER,
      NoOfJoined: DataTypes.INTEGER,
      Title: DataTypes.STRING,
      Content: DataTypes.STRING,
      DateTimeApply: DataTypes.DATE,
      DateTimeExpire: DataTypes.DATE,
      SpendingPartner: DataTypes.INTEGER,
      SpendingBookingStudio: DataTypes.INTEGER,
      Note: DataTypes.STRING,
      TypeReduce: DataTypes.INTEGER,
      ReduceValue: DataTypes.BIGINT,
      MaxReduce: DataTypes.BIGINT,
      MinApply: DataTypes.BIGINT,
      Category: DataTypes.STRING,
      CusApply: DataTypes.STRING,
      PartnerApply: DataTypes.STRING,
      PartnerJoin: DataTypes.STRING,
      PartnerConfirm: DataTypes.BOOLEAN,
      IsDeleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "SaleCode",
    }
  );
  return SaleCode;
};
