const express = require("express");
const {
  createComment,
  getAllComment,
  getCommentById,
  deleteComment,
  updateComment,
} = require("../controllers/userComment");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.post("/", createComment);
router.get("/", getAllComment);
router.get("/:id", getCommentById);
router.patch("/:id", updateComment);
router.delete("/:id", deleteComment);

module.exports = { router };
