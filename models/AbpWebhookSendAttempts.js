"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AbpWebhookSendAttempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AbpWebhookSendAttempt.init(
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      WebhookEventId: DataTypes.STRING,
      WebhookSubscriptionId: DataTypes.STRING,
      ResponseStatusCode: DataTypes.INTEGER,
      Response: DataTypes.TEXT("long"),
      TenantId: DataTypes.INTEGER,
      LastModificationTime: DataTypes.DATE,
      CreationTime: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "AbpWebhookSendAttempt",
    }
  );
  return AbpWebhookSendAttempt;
};
