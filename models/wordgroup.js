"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class WordGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ WordKey }) {
      this.hasMany(WordKey, { foreignKey: "WordGroupId" });
    }
  }
  WordGroup.init(
    {
      Name: DataTypes.STRING,
      Description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "WordGroup",
    }
  );
  return WordGroup;
};
