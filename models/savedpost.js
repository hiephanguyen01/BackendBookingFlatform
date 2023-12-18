"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SavedPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ BookingUser, Post }) {
      // define association here
      this.belongsTo(BookingUser, {
        foreignKey: "UserId",
      });
      this.belongsTo(Post);
    }
  }
  SavedPost.init(
    {
      PostId: DataTypes.BIGINT,
      UserId: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "SavedPost",
    }
  );
  return SavedPost;
};
