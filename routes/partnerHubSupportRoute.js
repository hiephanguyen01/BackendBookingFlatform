const express = require("express");
const { jwtAuth } = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");
const {
  deletePartnerHubSupport,
  updatePartnerHubSupport,
  createPartnerHubSupport,
  getPartnerHubSupportById,
  getAllPartnerHubSupport,
  getPartnerHubSupportById2,
  like,
} = require("../controllers/partnerHubSupport");

const router = express.Router();

router.get("/", getAllPartnerHubSupport);
router.get("/:id", getPartnerHubSupportById);
router.get("/x/:id", getPartnerHubSupportById2);
router.post("/", jwtAuth, createPartnerHubSupport);
router.patch("/:id", jwtAuth, updatePartnerHubSupport);
router.delete("/", jwtAuth, deletePartnerHubSupport);
router.post("/like/:id", like);

module.exports = { router };
