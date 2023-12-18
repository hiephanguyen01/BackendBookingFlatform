"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      StudioPost,
      StudioRoom,
      ModelPost,
      ModelServicePackage,
      MakeupPost,
      MakeupServicePackage,
      ClothesPost,
      PhotographerPost,
      PhotographerServicePackage,
    }) {
      // define association here
      this.belongsTo(StudioPost, { foreignKey: "StudioPostId" });
      this.belongsTo(StudioRoom, { foreignKey: "RoomId" });
      this.belongsTo(ModelPost, { foreignKey: "ModelPostId" });
      this.belongsTo(ModelServicePackage, { foreignKey: "ServiceId" });
      this.belongsTo(MakeupPost, { foreignKey: "MakeupPostId" });
      this.belongsTo(MakeupServicePackage, { foreignKey: "ServiceId" });
      this.belongsTo(ClothesPost, { foreignKey: "ClothesPostId" });
      this.belongsTo(PhotographerPost, { foreignKey: "PhotographerPostId" });
      this.belongsTo(PhotographerServicePackage, {
        foreignKey: "ServiceId",
      });
    }
  }
  CartItem.init(
    {
      CartId: DataTypes.INTEGER,
      Category: DataTypes.INTEGER,
      StudioPostId: DataTypes.INTEGER,
      PhotographerPostId: DataTypes.INTEGER,
      ClothesPostId: DataTypes.INTEGER,
      MakeupPostId: DataTypes.INTEGER,
      Size: DataTypes.INTEGER,
      Amount: DataTypes.INTEGER,
      Color: DataTypes.STRING,
      DevicePostId: DataTypes.INTEGER,
      ModelPostId: DataTypes.INTEGER,
      ServiceId: DataTypes.INTEGER,
      RoomId: DataTypes.INTEGER,
      OrderByTime: DataTypes.BOOLEAN,
      OrderByTimeFrom: DataTypes.DATE,
      OrderByTimeTo: DataTypes.DATE,
      OrderByDateFrom: DataTypes.DATE,
      OrderByDateTo: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "CartItem",
    }
  );
  return CartItem;
};
