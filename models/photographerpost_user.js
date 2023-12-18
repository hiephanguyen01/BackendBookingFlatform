"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PhotographerPost_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ PhotographerPost, BookingUser }) {
      // define association here
      this.belongsTo(PhotographerPost, {
        foreignKey: "PhotographerPostId",
        as: "Post",
      });
      this.belongsTo(BookingUser, {
        foreignKey: "UserId",
      });
    }
  }
  PhotographerPost_User.init(
    {
      PhotographerPostId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PhotographerPost_User",
    }
  );
  return PhotographerPost_User;
};
