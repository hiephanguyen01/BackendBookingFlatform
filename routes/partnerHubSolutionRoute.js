const express = require("express");
const { jwtAuth } = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");
const {
  deletePartnerHubSolution,
  updatePartnerHubSolution,
  createPartnerHubSolution,
  getPartnerHubSolutionById,
  getAllPartnerHubSolution,
  getPartnerHubSolutionById2,
  getAllPartnerHubHome,
  like,
} = require("../controllers/partnerHubSolution");

const router = express.Router();

router.get("/", getAllPartnerHubSolution);
router.get("/home", getAllPartnerHubHome);
router.get("/x/:id", getPartnerHubSolutionById2);
router.post("/", jwtAuth, createPartnerHubSolution);
router.patch("/:id", jwtAuth, updatePartnerHubSolution);
router.delete("/", jwtAuth, deletePartnerHubSolution);
router.get("/:id", getPartnerHubSolutionById);
router.post("/like/:id", like);

module.exports = { router };
