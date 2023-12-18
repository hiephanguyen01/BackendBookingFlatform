const express = require("express");
const {
  getAllWebhook,
  createWebHook,
  createWebHookEvents,
  DeleteWebhookSubcript,
  UpdateWebhookSubcript,
  webhookSubcriptDetail,
} = require("../controllers/adminWebhook");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.post("/events", jwtAuth, authorize({ setting: 3 }), createWebHookEvents);
router.get(
  "/subcription/:id",
  jwtAuth,
  authorize({ setting: 2 }),
  webhookSubcriptDetail
);
router.delete(
  "/subcription/:id",
  jwtAuth,
  authorize({ setting: 3 }),
  DeleteWebhookSubcript
);
router.patch(
  "/subcription/:id",
  jwtAuth,
  authorize({ setting: 3 }),
  UpdateWebhookSubcript
);
router.post("/subcription", jwtAuth, authorize({ setting: 3 }), createWebHook);
router.get("/", jwtAuth, authorize({ setting: 2 }), getAllWebhook);

module.exports = { router };
