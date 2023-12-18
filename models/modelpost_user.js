"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ModelPost_User extends Model {
    static associate({ ModelPost, BookingUser }) {
      this.belongsTo(ModelPost, {
        foreignKey: "ModelPostId",
        as: "Post",
      });
      this.belongsTo(BookingUser, {
        foreignKey: "UserId",
      });
    }
  }
  ModelPost_User.init(
    {
      ModelPostId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ModelPost_User",
    }
  );
  return ModelPost_User;
};
