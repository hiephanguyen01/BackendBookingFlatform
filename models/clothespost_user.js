"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ClothesPost_User extends Model {
    static associate({ ClothesPost, BookingUser }) {
      this.belongsTo(ClothesPost, {
        foreignKey: "ClothesPostId",
        as: "Post",
      });
      this.belongsTo(BookingUser, {
        foreignKey: "UserId",
      });
      
    }
  }
  ClothesPost_User.init(
    {
      ClothesPostId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ClothesPost_User",
    }
  );
  return ClothesPost_User;
};
