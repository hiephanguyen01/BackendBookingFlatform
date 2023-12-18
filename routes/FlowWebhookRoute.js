const express = require("express");
const {
  getAllFlowWebhooks,
  createFlowWebhook,
  updateFlowWebhook,
  deleteFlowWebhook,
} = require("../controllers/flowWebhookController");

const router = express.Router();

router.get("/", getAllFlowWebhooks);
router.post("/", createFlowWebhook);
router.patch("/:id", updateFlowWebhook);
router.delete("/:id", deleteFlowWebhook);

module.exports = { router };
