const express = require("express");
const {
  getTop10OrderClothesPost,
} = require("../controllers/clothesPostController");

const router = express.Router();

router.get("/top-10-order", getTop10OrderClothesPost);

module.exports = { router };
