const express = require("express");
const {
  connect,
  create,
  image,
} = require("../controllers/affiliatePublisherWebsite");
const { createAccessCount } = require("../controllers/affiliateLinkConnector");

const router = express.Router();

router.get("/", connect);
router.post("/", createAccessCount);
router.post("/register-link", create);
router.get("/image/:id", image);

module.exports = { router };
