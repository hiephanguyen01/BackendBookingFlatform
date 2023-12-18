const express = require("express");
const {
  createReport,
  getAllReport,
  getReportById,
} = require("../controllers/postReportController");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.post("/", jwtAuth, createReport);
router.get("/", getAllReport);
router.get("/:Id", getReportById);
router.delete("/:Id", getReportById);

module.exports = { router };
