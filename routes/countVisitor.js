const express = require("express");
const { count, getLastManyDay } = require("../controllers/countVisitor");

const router = express.Router();
router.get("/count", count);
router.get("/get", getLastManyDay);

module.exports = { router };
