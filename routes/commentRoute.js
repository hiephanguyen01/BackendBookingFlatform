const express = require("express");
const {
  createComment,
  getCommentsByPostId,
  getCommentsByPostReportId,
  likeComment,
  updateComment,
} = require("../controllers/comment");
const { jwtAuth } = require("../middlewares/jwtAuth");
const router = express.Router();

router.post("/like", jwtAuth, likeComment);
router.post("/", jwtAuth, createComment);
router.get("/:id", getCommentsByPostId);
router.patch("/:id", jwtAuth, updateComment);
router.get("/report-post/:id", getCommentsByPostReportId);

module.exports = { router };
