'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResentWatched extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ResentWatched.init({
    BookingUserId: DataTypes.INTEGER,
    PostId: DataTypes.INTEGER,
    Category: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ResentWatched',
  });
  return ResentWatched;
};