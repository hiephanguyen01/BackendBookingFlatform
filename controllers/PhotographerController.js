const { PhotographerPost } = require("../models");
const factory = require("./factoryController");
exports.getTop10OrderPhotographerPost = factory.getTop10Oder(PhotographerPost);
