"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post, BookingUser }) {
      this.belongsTo(Post, {
        foreignKey: "PostId",
      });
      this.belongsTo(BookingUser, {
        foreignKey: "BookingUserId",
      });
    }
  }
  Comment.init(
    {
      Content: DataTypes.TEXT("long"),
      Services: DataTypes.TEXT("long"),
      PostId: DataTypes.INTEGER,
      BookingUserId: DataTypes.INTEGER,
      TotalLike:DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
