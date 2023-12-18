"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({RegisterPartner}) {
      // define association here
      this.hasMany(RegisterPartner, {
        foreignKey: 'BankId'
      });
    }
  }
  Bank.init(
    {
      EngName: DataTypes.STRING,
      VNName: DataTypes.STRING,
      BusinessName: DataTypes.STRING,
      Url: DataTypes.STRING,
      Address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Bank",
      timestamps: false,
    }
  );
  return Bank;
};
