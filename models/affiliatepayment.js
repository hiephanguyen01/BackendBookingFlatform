"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AffiliatePayment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AffiliateUser }) {
      // define association here
      this.belongsTo(AffiliateUser, { foreignKey: "affiliateUserId" });
    }
  }
  AffiliatePayment.init(
    {
      period: DataTypes.DATE,
      unpaidLastPeriod: DataTypes.BIGINT,
      commissionThisPeriod: DataTypes.BIGINT,
      accumulatedUnpaidCommissions: DataTypes.BIGINT,
      TNCN: DataTypes.BIGINT,
      commissionPaidThisPeriod: DataTypes.BIGINT,
      commissionNextPeriod: DataTypes.BIGINT,
      payDate: DataTypes.DATE,
      payStatus: DataTypes.INTEGER,
      AffiliateUserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AffiliatePayment",
    }
  );
  return AffiliatePayment;
};
