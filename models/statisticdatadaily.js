'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StatisticDataDaily extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StatisticDataDaily.init({
    Date: DataTypes.DATE,
    Partner: DataTypes.BIGINT,
    DailyPartner: DataTypes.BIGINT,
    PartnerByCategory: DataTypes.STRING,
    PostByDay: DataTypes.STRING,
    PostByCategory: DataTypes.STRING,
    BookingUser: DataTypes.BIGINT,
    BookingUserByDay: DataTypes.BIGINT,
    BookingByDay: DataTypes.BIGINT,
    BookingSuccess: DataTypes.BIGINT,
    BookingFail: DataTypes.BIGINT,
    ValueOfBookingByDay: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'StatisticDataDaily',
  });
  return StatisticDataDaily;
};