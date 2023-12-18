"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MakeupPost_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ MakeupPost, BookingUser }) {
      this.belongsTo(MakeupPost, {
        foreignKey: "MakeupPostId",
        as: "Post",
      });
      this.belongsTo(BookingUser, {
        foreignKey: "UserId",
      });
    }
  }
  MakeupPost_User.init(
    {
      MakeupPostId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MakeupPost_User",
    }
  );
  return MakeupPost_User;
};
