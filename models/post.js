"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Comment,
      SavedPost,
      DaoReport,
      NotificationPost,
      BookingUser,
      Love,
    }) {
      this.hasMany(Comment, {
        as: "comments",
        foreignKey: "PostId",
      });
      this.hasMany(Love, {
        foreignKey: "PostId",
      });
      this.hasMany(SavedPost, {
        foreignKey: "PostId",
      });
      this.hasMany(DaoReport, {
        foreignKey: "PostId",
      });
      this.hasMany(NotificationPost, {
        foreignKey: "PostId",
      });
      this.belongsTo(BookingUser, {
        foreignKey: "BookingUserId",
      });
    }
  }
  Post.init(
    {
      Tags: DataTypes.STRING,
      Description: DataTypes.STRING,
      Image1: DataTypes.STRING,
      Image2: DataTypes.STRING,
      Image3: DataTypes.STRING,
      Image4: DataTypes.STRING,
      Image5: DataTypes.STRING,
      Image6: DataTypes.STRING,
      DriveImg1: DataTypes.STRING,
      DriveImg2: DataTypes.STRING,
      DriveImg3: DataTypes.STRING,
      DriveImg4: DataTypes.STRING,
      DriveImg5: DataTypes.STRING,
      TotalLikes: DataTypes.INTEGER,
      TotalComments: DataTypes.INTEGER,
      BookingUserId: DataTypes.INTEGER,
      CreationTime: DataTypes.DATE,
      CreatorUserId: DataTypes.BIGINT,
      LastModificationTime: DataTypes.DATE,
      LastModifierUserId: DataTypes.BIGINT,
      IsDeleted: DataTypes.BOOLEAN,
      DeleterUserId: DataTypes.BIGINT,
      DeletionTime: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Post",
    }
  );
  return Post;
};
