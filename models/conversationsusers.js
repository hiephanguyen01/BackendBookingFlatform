"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ConversationsUsers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ MessagesUser }) {
      ConversationsUsers.hasMany(MessagesUser, {
        foreignKey: "ConversationId",
      });
    }
  }
  ConversationsUsers.init(
    {
      PartnerId: DataTypes.BIGINT,
      UserId: DataTypes.BIGINT,
      AdminId: DataTypes.BIGINT,
      NoOfMessage: DataTypes.BIGINT,
    },
    {
      sequelize,
      modelName: "ConversationsUsers",
    }
  );
  return ConversationsUsers;
};
