"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdminAccount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdminAccount.init(
    {
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      partnerAccount: DataTypes.INTEGER,
      customerAccount: DataTypes.INTEGER,
      post: DataTypes.INTEGER,
      report: DataTypes.INTEGER,
      booking: DataTypes.INTEGER,
      export: DataTypes.INTEGER,
      dao: DataTypes.INTEGER,
      permission: DataTypes.INTEGER,
      notification: DataTypes.INTEGER,
      promo: DataTypes.INTEGER,
      affiliate: DataTypes.INTEGER,
      setting: DataTypes.INTEGER,
      chat: DataTypes.INTEGER,
      dashboard: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AdminAccount",
    }
  );
  return AdminAccount;
};
