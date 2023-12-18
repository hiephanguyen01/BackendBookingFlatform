const express = require("express");
const {
  getHotKeyList,
  getDetailHotKey,
  addHotKey,
  deleteHotKey,
  updateHotKey,
} = require("../controllers/hotKeyController");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");
const router = express.Router();
router.get("/", getHotKeyList);
router.post(
  "/",
  //  jwtAuth, authorize({ setting: 3 }),
  addHotKey
);
router.get("/:id", getDetailHotKey);
router.delete(
  "/:id",
  //   jwtAuth,
  //   authorize({ setting: 3 }),
  deleteHotKey
);
router.put(
  "/:id",
  //   jwtAuth,
  //   authorize({ setting: 3 }),
  updateHotKey
);
module.exports = { router };
