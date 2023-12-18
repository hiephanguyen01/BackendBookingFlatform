'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AffiliateAccessCount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AffiliateAccessCount.init({
    AffiliateUserId: DataTypes.INTEGER,
    IpAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AffiliateAccessCount',
  });
  return AffiliateAccessCount;
};