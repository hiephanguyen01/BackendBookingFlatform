"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DaoReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ BookingUser, Post }) {
      this.belongsTo(BookingUser, {
        foreignKey: "BookingUserId",
      });
      this.belongsTo(Post, {
        foreignKey: "PostId",
      });
    }
  }
  DaoReport.init(
    {
      PostId: DataTypes.INTEGER,
      BookingUserId: DataTypes.INTEGER,
      Content: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DaoReport",
    }
  );
  return DaoReport;
};
