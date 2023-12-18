const express = require("express");

const {
  getWordGroup,
  createWordGroup,
  createWord,
  updateWord,
  deleteWord,
  updateGroupWord,
  deleteWordGroup,
} = require("../controllers/wordController");
const router = express.Router();

router.get("/", getWordGroup);
router.post("/", createWordGroup);
router.patch("/", updateGroupWord);
router.delete("/", deleteWordGroup);

router.post("/add", createWord);
router.patch("/update", updateWord);
router.delete("/delete", deleteWord);

module.exports = { router };
