const express = require("express");
const { getTop10OrderDevicePost } = require("../controllers/DevicePostController");

const router = express.Router();

router.get("/top-10-order",getTop10OrderDevicePost);

module.exports = { router };
