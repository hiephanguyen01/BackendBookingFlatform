const { ModelPost } = require("../models");
const factory = require("./factoryController");

exports.getTop10OrderModelPost = factory.getTop10Oder(ModelPost);
