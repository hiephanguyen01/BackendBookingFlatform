const { DevicePost } = require("../models");
const factory = require("./factoryController");

exports.getTop10OrderDevicePost = factory.getTop10Oder(DevicePost);
