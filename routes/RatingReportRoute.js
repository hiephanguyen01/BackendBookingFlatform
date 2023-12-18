const express = require("express");
const {
  getDetailById,
  getRatingByPostId,
  getAllRatingStudioPostId,
  getNumberRate,
  createRatingBooking,
  getAll,
  getAllByPartner,
  replyComments,
} = require("../controllers/ratingReport");
const upload = require("../middlewares/upload");
const { jwtAuth } = require("../middlewares/jwtAuth");
const { authorize } = require("../middlewares/authorize");

const router = express.Router();

router.get("/partner", jwtAuth, getAllByPartner);
router.patch("/partner/update", jwtAuth, replyComments);
router.post("/rating/:id", jwtAuth, upload.array("image"), createRatingBooking);
router.get("/:Id", getDetailById);
router.get("/rating/:id", getRatingByPostId);
router.get("/studioPost/rating/:id", getAllRatingStudioPostId);
router.delete("/studioPost/rating/:id", getAllRatingStudioPostId);
router.get("/", jwtAuth, authorize({ report: 2 }), getAll);
module.exports = { router };
