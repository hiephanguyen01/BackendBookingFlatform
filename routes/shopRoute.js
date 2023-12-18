const express = require("express");
const { getShopDetail } = require("../controllers/shop");

const router = express.Router();

router.get("/:id", getShopDetail);

module.exports = { router };
