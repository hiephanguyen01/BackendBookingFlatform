"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NumberOfVisit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NumberOfVisit.init(
    {
      Date: DataTypes.DATE,
      AppCount: DataTypes.INTEGER,
      WebCount: DataTypes.INTEGER,
      PartnerCount: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "NumberOfVisit",
    }
  );
  return NumberOfVisit;
};
