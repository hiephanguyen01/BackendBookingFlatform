"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ParnerComment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ RegisterPartner }) {
      // define association here
      this.belongsTo(RegisterPartner, {
        foreignKey: "PartnerId",
      });
    }
  }
  ParnerComment.init(
    {
      Content: DataTypes.STRING,
      PartnerId: DataTypes.INTEGER,
      PostId: DataTypes.INTEGER,
      Services: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ParnerComment",
    }
  );
  return ParnerComment;
};
