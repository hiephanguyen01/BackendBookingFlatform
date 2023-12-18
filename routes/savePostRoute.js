const express = require("express");
const {
  createSavedPost,
  getListSavePost,
  deleteSavedPost,
  getListPostById,
} = require("../controllers/savedPost");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.post("/", createSavedPost);
router.get("/me", jwtAuth, getListPostById);
router.get("/", getListSavePost);
router.delete("/", deleteSavedPost);
module.exports = { router };
