const express = require("express");
const {
  getAllStudioPost,
  updateStudioPostById,
  getStudioPostById,
  deleteStudioPostById,
  getTop10OrderStudioPost,
  getSimilar,
  getDistance123,
  getStudioPostByTenantId,
  filterRelatedServices,
  getRatingExisted,
  toggleNotificationDao,
  getAllCalendarAndPrice,
  getAllPostAff,
  getStudioPostByIdAdmin,
  createStudioPost,
  getAllPostPartner,
  getPostPartnerId,
  updatePostPartner,
} = require("../controllers/studioPost");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => ({
  name: `Image${item}`,
  maxCount: 1,
}));
const router = express.Router();
router.get("/allPosts", jwtAuth, getAllPostPartner);
router.patch(
  "/byPartnerId/:id",
  jwtAuth,
  upload.fields(arr),
  updatePostPartner
);
router.get("/byPartnerId/:id", jwtAuth, getPostPartnerId);
router.post("/create", jwtAuth, upload.fields(arr), createStudioPost);
router.get("/ratingByMe", jwtAuth, getRatingExisted);
router.get("/top-10-order", getTop10OrderStudioPost);
router.get("/similar/:id", getSimilar);
router.get("/byid/:id", getStudioPostByIdAdmin);
router.get("/byid", getStudioPostById);
router.get("/distance/:id", getDistance123);
router.get("/tenant-id", getStudioPostByTenantId);
router.patch("/byid", jwtAuth, authorize({ post: 3 }), updateStudioPostById);
router.delete("/byid", jwtAuth, authorize({ post: 3 }), deleteStudioPostById);
router.get("/affiliate", getAllStudioPost);
router.get("/filter-related-service", filterRelatedServices);
router.get("/calendar-price", getAllCalendarAndPrice);
router.get("/post-aff", getAllPostAff);
router.get("/", jwtAuth, authorize({ post: 2 }), getAllStudioPost);

module.exports = { router };
