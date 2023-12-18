const { MakeupPost } = require("../models");
const factory = require("./factoryController");

exports.getTop10OrderMakeupPost = factory.getTop10Oder(MakeupPost);
