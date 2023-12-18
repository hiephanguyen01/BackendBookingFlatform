const express = require("express");
const {
  updateAdminNotificationKey,
  getAllNotification,
  updateReaded,
} = require("../controllers/adminNotificationKey");
const upload = require("../middlewares/upload");

const router = express.Router();

router.patch("/", upload.single("P12Certificate"), updateAdminNotificationKey);
router.get("/", getAllNotification);
router.patch("/:id", updateReaded);

module.exports = { router };
