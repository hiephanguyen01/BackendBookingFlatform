"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PartnerHubSupport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PartnerHubSupport.init(
    {
      image: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      isVisible: DataTypes.BOOLEAN,
      adminId: DataTypes.INTEGER,
      like: DataTypes.INTEGER,
      dislike: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PartnerHubSupport",
    }
  );
  return PartnerHubSupport;
};
