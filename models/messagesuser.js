"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MessagesUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ConversationsUsers }) {
      MessagesUser.belongsTo(ConversationsUsers, {
        foreignKey: "ConversationId",
      });
    }
  }
  MessagesUser.init(
    {
      ConversationId: DataTypes.BIGINT,
      Content: DataTypes.STRING,
      PartnerId: DataTypes.BIGINT,
      UserId: DataTypes.BIGINT,
      AdminId: DataTypes.BIGINT,
      IsRead: DataTypes.BOOLEAN,
      Type: DataTypes.STRING,
      fileName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "MessagesUser",
    }
  );
  return MessagesUser;
};
