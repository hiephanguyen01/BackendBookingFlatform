"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdminNotificationSig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdminNotificationSig.init(
    {
      title: DataTypes.STRING,
      content: DataTypes.STRING,
      event: DataTypes.STRING,
      isReaded: DataTypes.BOOLEAN,
      category: DataTypes.INTEGER,
      type: DataTypes.STRING,
      TenantId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AdminNotificationSig",
    }
  );
  return AdminNotificationSig;
};
