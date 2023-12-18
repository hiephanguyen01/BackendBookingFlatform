const express = require("express");
const { getTop10OrderMakeupPost } = require("../controllers/makeupPostController");

const router = express.Router();

router.get("/top-10-order",getTop10OrderMakeupPost);

module.exports = { router };
