"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AbpWebhookEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AbpWebhookEvent.init(
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      Data: DataTypes.TEXT("long"),
      TenantId: DataTypes.INTEGER,
      IsDeleted: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
      WebhookName: DataTypes.STRING,
      CreationTime: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      WebhookSubscriptionId: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "AbpWebhookEvent",
    }
  );
  return AbpWebhookEvent;
};
