"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AffiliateProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ AffiliateUser, StudioBooking,PhotographerBooking,MakeUpBooking,ModelBooking }) {
      // define association here
      this.belongsTo(AffiliateUser, { foreignKey: "affiliateUserId" });
      this.belongsTo(StudioBooking, { foreignKey: "OrderId" });
      this.belongsTo(PhotographerBooking, { foreignKey: "OrderId" });
      this.belongsTo(MakeUpBooking, { foreignKey: "OrderId" });
      this.belongsTo(ModelBooking, { foreignKey: "OrderId" });
    }
  }
  AffiliateProduct.init(
    {
      affiliateUserId: DataTypes.INTEGER,
      OrderId: DataTypes.INTEGER,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      category: DataTypes.INTEGER,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "AffiliateProduct",
    }
  );
  return AffiliateProduct;
};
