const express = require("express");
const {
  createReport,
  getAllReport,
  getReportById,
  deleteReport,
} = require("../controllers/daoReportController");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.post("/", jwtAuth, createReport);
router.get("/", getAllReport);
router.get("/:Id", getReportById);
router.delete("/:Id", deleteReport);

module.exports = { router };
