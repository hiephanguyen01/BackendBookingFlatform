"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StatisticDataWeek extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StatisticDataWeek.init(
    {
      From: DataTypes.DATE,
      To: DataTypes.DATE,
      Partner: DataTypes.BIGINT,
      WeekPartner: DataTypes.BIGINT,
      PartnerByCategory: DataTypes.STRING,
      PostByWeek: DataTypes.STRING,
      PostByCategory: DataTypes.STRING,
      BookingUser: DataTypes.BIGINT,
      BookingUserByWeek: DataTypes.BIGINT,
      BookingByWeek: DataTypes.BIGINT,
      BookingSuccess: DataTypes.BIGINT,
      BookingFail: DataTypes.BIGINT,
      ValueOfBookingByWeek: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "StatisticDataWeek",
    }
  );
  return StatisticDataWeek;
};
