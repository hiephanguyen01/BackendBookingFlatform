const express = require("express");
const { getAllMyRatings } = require("../controllers/myRatings");
const { jwtAuth } = require("../middlewares/jwtAuth");
const router = express.Router();
router.get("/", jwtAuth, getAllMyRatings);
module.exports = { router };
