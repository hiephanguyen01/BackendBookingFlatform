const express = require("express");
const {
  postPost,
  getAllPostNew,
  deletePost,
  getPostByIdNew,
  getAllReportPostNew,
  updatePost,
} = require("../controllers/postPost");
const {
  toggleNotificationDao,
  getAllNotificationDao,
} = require("../controllers/studioPost");
const { jwtAuth } = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");

const router = express.Router();
router.post("/toggle-notification", jwtAuth, toggleNotificationDao);
router.get("/notification-dao", jwtAuth, getAllNotificationDao);
router.post("/", jwtAuth, upload.array("image"), postPost);
router.get("/", getAllPostNew);
router.get("/report", getAllReportPostNew);
router.get("/:id", getPostByIdNew);
router.delete("/:id", deletePost);
router.patch("/:id", jwtAuth, upload.array("image"), updatePost);

module.exports = { router };
