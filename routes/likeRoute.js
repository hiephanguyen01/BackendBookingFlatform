const express = require("express");
const {
  createLove,
  getLovesByPostId,
  getLovesByUserId,
} = require("../controllers/likes");

const router = express.Router();

router.post("/", createLove);
router.get("/:id", getLovesByPostId);
router.get("/", getLovesByUserId);

module.exports = { router };
