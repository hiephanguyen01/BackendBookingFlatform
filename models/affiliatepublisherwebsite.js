'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AffiliatePublisherWebsite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AffiliatePublisherWebsite.init({
    link: DataTypes.STRING,
    isConnected: DataTypes.BOOLEAN,
    affiliateUserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AffiliatePublisherWebsite',
  });
  return AffiliatePublisherWebsite;
};