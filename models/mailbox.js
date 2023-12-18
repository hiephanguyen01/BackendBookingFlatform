'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MailBox extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MailBox.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    content: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    isFeedback: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'MailBox',
  });
  return MailBox;
};