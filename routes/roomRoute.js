const express = require("express");
const { getNumberRate } = require("../controllers/ratingReport");
const {
  getAllRoom,
  getDetailRoom,
  getAllService,
  getDetailService,
  updateService,
  createRoom,
  getAllRoomByPartnerId,
  getDetailServiceById,
  deleteRoom,
  updateRoomPartner,
} = require("../controllers/room");
const upload = require("../middlewares/upload");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => ({
  name: `Image${item}`,
  maxCount: 1,
}));

router.patch("/detail/:id", jwtAuth, upload.fields(arr),updateRoomPartner);
router.get("/allRoomByPostId/:id", jwtAuth, getAllRoomByPartnerId);
router.post("/create", jwtAuth, upload.fields(arr), createRoom);
router.get("/all", getAllService);
router.get("/detail/:id", getDetailServiceById);
router.get("/detail", getDetailService);
router.delete("/:id", deleteRoom);
router.patch("/detail", updateService);
router.get("/number-rate/:id", getNumberRate);
router.get("/", getAllRoom);
router.get("/:id", getDetailRoom);

module.exports = { router };
