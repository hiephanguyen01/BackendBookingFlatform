const express = require("express");
const {
  all,
  allAdmin,
  allAdminExport,
  allExport,
  paid,
} = require("../controllers/afffiliatePayment");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.get("/", jwtAuth, all);
router.get("/admin", allAdmin);
router.get("/admin-export", allAdminExport);
router.get("/export/:userId", allExport);
router.get("/paid", paid);

module.exports = { router };
