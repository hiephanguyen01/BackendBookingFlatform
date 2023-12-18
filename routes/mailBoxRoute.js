const express = require("express");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");
const {
  createMail,
  getMailById,
  getAllMailBox,
  updateMail,
} = require("../controllers/MailBoxController");

const router = express.Router();

router.get("/", getAllMailBox);
router.get("/:id", jwtAuth, getMailById);
router.post("/", createMail);
router.patch("/:id", jwtAuth, updateMail);

module.exports = { router };
