const express = require("express");
const {
  getAllBank,
  getBankById,
  createBank,
  updateBank,
  deleteBank,
} = require("../controllers/bankController");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.get("/", getAllBank);
router.get("/:id", jwtAuth, authorize({ setting: 2 }), getBankById);
router.post("/", jwtAuth, authorize({ setting: 3 }), createBank);
router.patch("/:id", jwtAuth, authorize({ setting: 3 }), updateBank);
router.delete("/:id", jwtAuth, authorize({ setting: 3 }), deleteBank);

module.exports = { router };
