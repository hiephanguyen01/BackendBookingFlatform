"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Shop extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ClothesPost, ClothesGroup }) {
      // define association here
      this.hasMany(ClothesPost, {
        foreignKey: "ShopId",
      });
      this.hasMany(ClothesGroup, {
        foreignKey: "ShopId",
      });
    }
  }
  Shop.init(
    {
      TenantId: DataTypes.INTEGER,
      Name: DataTypes.STRING,
      Address: DataTypes.STRING,
      Latitude: DataTypes.DOUBLE,
      Longtitude: DataTypes.DOUBLE,
      Description: DataTypes.STRING,
      IsAuthorized: DataTypes.BOOLEAN,
      Avatar: DataTypes.STRING,
      BookingUserId: DataTypes.INTEGER,
      CreationTime: DataTypes.DATE,
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      DeleterUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
      HourCloseDefault: DataTypes.INTEGER,
      HourOpenDefault: DataTypes.INTEGER,
      MinutesCloseDefault: DataTypes.INTEGER,
      MinutesOpenDefault: DataTypes.INTEGER,
      IsHotDeal: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Shop",
    }
  );
  return Shop;
};
