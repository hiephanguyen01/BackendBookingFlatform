"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StatisticData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StatisticData.init(
    {
      Month: DataTypes.INTEGER,
      Year: DataTypes.INTEGER,
      Partner: DataTypes.BIGINT,
      MonthPartner: DataTypes.BIGINT,
      PartnerByCategory: DataTypes.STRING,
      PostByMonth: DataTypes.STRING,
      PostByCategory: DataTypes.STRING,
      BookingUser: DataTypes.BIGINT,
      BookingUserByMonth: DataTypes.BIGINT,
      BookingByMonth: DataTypes.BIGINT,
      BookingSuccess: DataTypes.BIGINT,
      BookingFail: DataTypes.BIGINT,
      ValueOfBookingByMonth: DataTypes.BIGINT,
      TotalBookingValue: DataTypes.STRING,
      NumberOfBookingAll: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "StatisticData",
    }
  );
  return StatisticData;
};
