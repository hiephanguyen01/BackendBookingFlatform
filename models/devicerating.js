"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DeviceRating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ DevicePost }) {
      // define association here
      this.belongsTo(DevicePost, {
        foreignKey: "DevicePostId",
      });
    }
  }
  DeviceRating.init(
    {
      TenantId: DataTypes.STRING,
      Rate: DataTypes.INTEGER,
      Description: DataTypes.STRING,
      Image1: DataTypes.STRING,
      Image2: DataTypes.STRING,
      Image3: DataTypes.STRING,
      Image4: DataTypes.STRING,
      Image5: DataTypes.STRING,
      Image6: DataTypes.STRING,
      Image7: DataTypes.STRING,
      Image8: DataTypes.STRING,
      Image9: DataTypes.STRING,
      Image10: DataTypes.STRING,
      video1: DataTypes.STRING,
      video2: DataTypes.STRING,
      video3: DataTypes.STRING,
      video4: DataTypes.STRING,
      video5: DataTypes.STRING,
      video6: DataTypes.STRING,
      video7: DataTypes.STRING,
      video8: DataTypes.STRING,
      video9: DataTypes.STRING,
      video10: DataTypes.STRING,
      BookingUserId: DataTypes.INTEGER,
      DevicePostId: DataTypes.INTEGER,
      DeviceBookingId: DataTypes.INTEGER,
      CreationTime: DataTypes.DATE,
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      DeletedUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
      IsAnonymous: DataTypes.BOOLEAN,
      ReplyComment: DataTypes.STRING,
      VideoThumb1: DataTypes.STRING,
      VideoThumb2: DataTypes.STRING,
      VideoThumb3: DataTypes.STRING,
      VideoThumb4: DataTypes.STRING,
      VideoThumb5: DataTypes.STRING,
      VideoThumb6: DataTypes.STRING,
      VideoThumb7: DataTypes.STRING,
      VideoThumb8: DataTypes.STRING,
      VideoThumb9: DataTypes.STRING,
      VideoThumb10: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DeviceRating",
    }
  );
  return DeviceRating;
};
