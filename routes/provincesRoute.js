const express = require("express");
const {
  getProvincesList,
  getDetailProvince,
  addProvince,
  deleteProvince,
  updateProvince,
} = require("../controllers/provinces");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.get("/", getProvincesList);
router.get("/:Id", jwtAuth, authorize({ setting: 2 }), getDetailProvince);
router.post("/", jwtAuth, authorize({ setting: 3 }), addProvince);
router.delete("/:Id", jwtAuth, authorize({ setting: 3 }), deleteProvince);
router.put("/:Id", jwtAuth, authorize({ setting: 3 }), updateProvince);
module.exports = { router };
