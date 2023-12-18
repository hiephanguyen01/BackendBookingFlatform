"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DevicePost_User extends Model {
    static associate({ DevicePost, BookingUser }) {
      this.belongsTo(DevicePost, {
        foreignKey: "DevicePostId",
        as: "Post",
      });
      this.belongsTo(BookingUser, {
        foreignKey: "UserId",
      });
    }
  }
  DevicePost_User.init(
    {
      DevicePostId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DevicePost_User",
    }
  );
  return DevicePost_User;
};
