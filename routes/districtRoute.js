const express = require("express");
const {
  getDistrictsList,
  getDetailDistrict,
  addDistrict,
  deleteDistrict,
  updateDistrict,
} = require("../controllers/district");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");
const router = express.Router();
router.get("/:id", getDistrictsList);
router.post("/", jwtAuth, authorize({ setting: 3 }), addDistrict);
router.get("/districtById/:id", getDetailDistrict);
router.delete(
  "/districtById/:id",
  jwtAuth,
  authorize({ setting: 3 }),
  deleteDistrict
);
router.put(
  "/districtById/:id",
  jwtAuth,
  authorize({ setting: 3 }),
  updateDistrict
);
module.exports = { router };
