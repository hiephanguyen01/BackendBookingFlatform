const express = require("express");
const {
  getAllBooking,
  getBookingById,
  updateBookingById,
  createBooking,
  updateBookingByIdentifyCode,
  getBookingPersonal,
  manuallyUpdateForAdmin,
  getBookingByIdentifyCode,
  getOrderStatus,
  updateRefundBookingById,
  scheduleAndPrice,
  checkOrderTimeExits,
  getAllBookingPartner,
  getLatestBookingByUserId,
} = require("../controllers/studioBooking");
const upload = require("../middlewares/upload");
const { jwtAuth } = require("../middlewares/jwtAuth");
const { authorize } = require("../middlewares/authorize");
const router = express.Router();

router.post("/", jwtAuth, createBooking);
router.post("/all", jwtAuth, authorize({ booking: 2 }), getAllBooking);
router.get("/personal", jwtAuth, getBookingPersonal);
router.get("/order-status", jwtAuth, getOrderStatus);
router.get("/byid", getBookingById);
router.get("/scheduleAndPrice", scheduleAndPrice);
router.get("/byIdentifyCode", getBookingByIdentifyCode);
router.get("/latestBookingbyUserId", getLatestBookingByUserId);
router.patch("/byid", jwtAuth, authorize({ booking: 3 }), updateBookingById);
router.post("/forAdmin/:id", manuallyUpdateForAdmin);
router.post("/checkOrderTimeExits", checkOrderTimeExits);
router.patch("/refund", updateRefundBookingById);

router.post("/partner", jwtAuth, getAllBookingPartner);

router.put(
  "/update/:IdentifyCode",
  jwtAuth,
  upload.single("EvidenceImage"),
  updateBookingByIdentifyCode
);

module.exports = { router };
