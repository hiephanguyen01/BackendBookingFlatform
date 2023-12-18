"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WordKey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({}) {}
  }
  WordKey.init(
    {
      Name: DataTypes.STRING,
      Description: DataTypes.STRING,
      WordGroupId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "WordKey",
    }
  );
  return WordKey;
};
