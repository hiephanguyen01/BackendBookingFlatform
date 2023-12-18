"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SecurityQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ RegisterPartner }) {
      // define association here
    //   this.belongsTo(RegisterPartner, {
    //     foreignKey: "SecurityQuestion1Id",
    //   });
    }
  }
  SecurityQuestion.init(
    {
      Question: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "SecurityQuestion",
    }
  );
  return SecurityQuestion;
};
