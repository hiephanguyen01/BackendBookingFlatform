"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PromoteCode_UserSave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ SaleCode, BookingUser }) {
      this.belongsTo(SaleCode, {
        foreignKey: "PromoteCodeId",
      });
      this.belongsTo(BookingUser, {
        foreignKey: "BookingUserId",
      });
    }
  }
  PromoteCode_UserSave.init(
    {
      PromoteCodeId: DataTypes.INTEGER,
      BookingUserId: DataTypes.INTEGER,
      Used: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PromoteCode_UserSave",
    }
  );
  return PromoteCode_UserSave;
};
