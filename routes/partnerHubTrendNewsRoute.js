const express = require("express");
const { jwtAuth } = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");
const {
  deletePartnerHubTrendNews,
  updatePartnerHubTrendNews,
  createPartnerHubTrendNews,
  getPartnerHubTrendNewsById,
  getAllPartnerHubTrendNews,
  getPartnerHubTrendNewsById2,
  like,
} = require("../controllers/partnerHubTrendNews");

const router = express.Router();

router.get("/", getAllPartnerHubTrendNews);
router.get("/:id", getPartnerHubTrendNewsById);
router.get("/x/:id", getPartnerHubTrendNewsById2);
router.post("/", jwtAuth, createPartnerHubTrendNews);
router.patch("/:id", jwtAuth, updatePartnerHubTrendNews);
router.delete("/", jwtAuth, deletePartnerHubTrendNews);
router.post("/like/:id", like);

module.exports = { router };
