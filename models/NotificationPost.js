"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NotificationPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      // define association here
      this.belongsTo(Post);
    }
  }
  NotificationPost.init(
    {
      PostId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      IsActive: DataTypes.BOOLEAN,
      CreationTime: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "NotificationPost",
    }
  );

  return NotificationPost;
};
