"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AbpWebhookSubscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AbpWebhookSubscription.init(
    {
      Id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      Method: DataTypes.TEXT("long"),
      WebhookUri: DataTypes.TEXT("long"),
      WebhookName: DataTypes.STRING,
      Body: DataTypes.TEXT("long"),
      Secret: DataTypes.STRING,
      Headers: DataTypes.STRING,
      Params: DataTypes.TEXT("long"),
      IsActive: DataTypes.BIGINT,
      FlowId:DataTypes.INTEGER,
      CreatorUserId: DataTypes.INTEGER,
      CreationTime: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "AbpWebhookSubscription",
    }
  );
  return AbpWebhookSubscription;
};
