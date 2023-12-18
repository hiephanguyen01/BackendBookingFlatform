const express = require("express");
const {
  getAllBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  getBannerById,
} = require("../controllers/banner");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/", getAllBanner);
router.get("/:id", jwtAuth, authorize({ setting: 2 }), getBannerById);
router.post(
  "/",
  jwtAuth,
  authorize({ setting: 3 }),
  upload.array("Image"),
  createBanner
);
router.patch(
  "/:id",
  jwtAuth,
  authorize({ setting: 3 }),
  upload.array("Image"),
  updateBanner
);
router.delete("/:id", jwtAuth, authorize({ setting: 3 }), deleteBanner);

module.exports = { router };
