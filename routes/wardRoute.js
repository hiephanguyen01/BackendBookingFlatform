const express = require("express");
const {
  getWardsList,
  getDetailWard,
  addWard,
  deleteWard,
  updateWard,
} = require("../controllers/wards");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");
const router = express.Router();
router.get("/", getWardsList);
router.post("/", jwtAuth, authorize({ setting: 3 }), addWard);
router.get("/wardById/:id", getDetailWard);
router.delete("/wardById/:id", jwtAuth, authorize({ setting: 3 }), deleteWard);
router.put("/wardById/:id", jwtAuth, authorize({ setting: 3 }), updateWard);
module.exports = { router };
