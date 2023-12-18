"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Banner.init(
    {
      Name: DataTypes.STRING,
      Description: DataTypes.STRING,
      Creator: DataTypes.STRING,
      IsVisible: DataTypes.BOOLEAN,
      Image1: DataTypes.STRING,
      Image2: DataTypes.STRING,
      Priority: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Banner",
    }
  );
  return Banner;
};
