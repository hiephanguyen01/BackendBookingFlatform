"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ScheduleAndPriceDeviceByDate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ScheduleAndPriceDeviceByDate.init(
    {
      PriceByDate: DataTypes.DOUBLE,
      PriceByHour: DataTypes.DOUBLE,
      DepositByDate: DataTypes.INTEGER,
      DepositPaymentTypeByDate: DataTypes.INTEGER,
      DepositByHour: DataTypes.INTEGER,
      DepositPaymentTypeByHour: DataTypes.INTEGER,
      PaymentByDate: DataTypes.BOOLEAN,
      PaymentByHour: DataTypes.BOOLEAN,
      CancelPriceByDate: DataTypes.INTEGER,
      CancelPriceByHour: DataTypes.INTEGER,
      AbsentPriceByDate: DataTypes.INTEGER,
      AbsentPriceByHour: DataTypes.INTEGER,
      FreeCancelByDate: DataTypes.STRING,
      FreeCancelByHour: DataTypes.STRING,
      Open: DataTypes.BOOLEAN,
      OpenMorning: DataTypes.BOOLEAN,
      OpenAfternoon: DataTypes.BOOLEAN,
      Date: DataTypes.STRING,
      ServiceId: DataTypes.INTEGER,
      TenantId: DataTypes.INTEGER,
      OpenByDate: DataTypes.BOOLEAN,
      OpenByHour: DataTypes.BOOLEAN,
      DateTime: DataTypes.DATE,
      MorningOpenHour: DataTypes.INTEGER,
      MorningOpenMinutes: DataTypes.INTEGER,
      MorningCloseHour: DataTypes.INTEGER,
      MorningCloseMinutes: DataTypes.INTEGER,
      AfternoonOpenHour: DataTypes.INTEGER,
      AfternoonOpenMinutes: DataTypes.INTEGER,
      AfternoonCloseHour: DataTypes.INTEGER,
      AfternoonCloseMinutes: DataTypes.INTEGER,
      BreakTimeHour: DataTypes.INTEGER,
      BreakTimeMinutes: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ScheduleAndPriceDeviceByDate",
    }
  );
  return ScheduleAndPriceDeviceByDate;
};
