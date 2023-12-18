const express = require("express");
const {
  createNotification,
  getAllNotification,
  cancelNotification,
  getNotificationById,
  filterNotification,
  getAllUser,
} = require("../controllers/adminNotification");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/noti", getAllNotification);
router.post(
  "/",
  jwtAuth,
  authorize({ notification: 3 }),
  upload.single("image"),
  createNotification
);
router.patch(
  "/:id",
  jwtAuth,
  authorize({ notification: 3 }),
  cancelNotification
);
router.get(
  "/noti/:id",
  jwtAuth,
  authorize({ notification: 2 }),
  getNotificationById
);
router.post(
  "/filter",
  jwtAuth,
  authorize({ notification: 2 }),
  filterNotification
);
router.get("/user", getAllUser);

module.exports = { router };
