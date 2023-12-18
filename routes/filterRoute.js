const express = require("express");
const { createDistrict, getAllDistrict } = require("../controllers/district");
const {
  filterOption,
  advanceFilter,
  advanceFilterMobile,
} = require("../controllers/filterController");

const router = express.Router();

router.get("/", filterOption);
router.post("/advance", advanceFilter);
router.post("/advance/mobile", advanceFilterMobile);

module.exports = { router };
