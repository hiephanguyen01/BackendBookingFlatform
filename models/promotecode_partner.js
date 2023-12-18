"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PromoteCode_Partner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ RegisterPartner, SaleCode }) {
      this.belongsTo(RegisterPartner, {
        foreignKey: "PartnerId",
      });
      this.belongsTo(SaleCode, {
        foreignKey: "PromoteCodeId",
      });
    }
  }
  PromoteCode_Partner.init(
    {
      PromoteCodeId: DataTypes.INTEGER,
      PartnerId: DataTypes.INTEGER,
      PartnerConfirm: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "PromoteCode_Partner",
    }
  );
  return PromoteCode_Partner;
};
