const express = require("express");
const { getTop10OrderModelPost } = require("../controllers/modelController");

const router = express.Router();

router.get("/top-10-order",getTop10OrderModelPost);

module.exports = { router };
