"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudioPost_User extends Model {
    static associate({ StudioPost, BookingUser }) {
      // define association here
      this.belongsTo(StudioPost, {
        foreignKey: "StudioPostId",
        as: "Post",
      });
      this.belongsTo(BookingUser, {
        foreignKey: "UserId",
      });
    }
  }
  StudioPost_User.init(
    {
      StudioPostId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StudioPost_User",
    }
  );
  return StudioPost_User;
};
