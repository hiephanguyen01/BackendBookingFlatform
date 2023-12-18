'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HotKey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HotKey.init({
    name: DataTypes.STRING,
    onSearch: DataTypes.INTEGER,
    isVisible: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'HotKey',
  });
  return HotKey;
};