const express = require("express");
const {
  getAllAskedQuestion,
  createAskedQuestion,
  updateAskedQuestion,
  deleteAskedQuestion,
  getAskedQuestionById,
} = require("../controllers/askedQuestion");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.get("/", getAllAskedQuestion);
router.get("/:id", getAskedQuestionById);
router.post("/", jwtAuth, authorize({ setting: 3 }), createAskedQuestion);
router.patch("/:id", jwtAuth, authorize({ setting: 3 }), updateAskedQuestion);
router.delete("/:id", jwtAuth, authorize({ setting: 3 }), deleteAskedQuestion);

module.exports = { router };
