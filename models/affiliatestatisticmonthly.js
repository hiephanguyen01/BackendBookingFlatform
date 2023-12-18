"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AffiliateStatisticMonthly extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AffiliateStatisticMonthly.init(
    {
      Month: DataTypes.INTEGER,
      Year: DataTypes.INTEGER,
      AffiliateUserId: DataTypes.INTEGER,
      Booking: DataTypes.BIGINT,
      BookingValue: DataTypes.BIGINT,
      Click: DataTypes.BIGINT,
      Commission: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "AffiliateStatisticMonthly",
    }
  );
  return AffiliateStatisticMonthly;
};
