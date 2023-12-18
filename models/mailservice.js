"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MailService extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MailService.init(
    {
      user: DataTypes.STRING,
      pass: DataTypes.STRING,
      service: DataTypes.STRING,
      host: DataTypes.STRING,
      port: DataTypes.INTEGER,
      isActivate: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "MailService",
    }
  );
  return MailService;
};
