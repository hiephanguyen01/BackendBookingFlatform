"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ BookingUser }) {
      this.belongsTo(BookingUser, {
        foreignKey: "BookingUserId",
      });
    }
  }
  PostReport.init(
    {
      Category: DataTypes.INTEGER,
      PostId: DataTypes.INTEGER,
      BookingUserId: DataTypes.INTEGER,
      Content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PostReport",
    }
  );
  return PostReport;
};
