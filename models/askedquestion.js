"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AskedQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AskedQuestion.init(
    {
      Question: DataTypes.STRING,
      Answer: DataTypes.STRING,
      AskedQuestionCategory: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "AskedQuestion",
    }
  );
  return AskedQuestion;
};
