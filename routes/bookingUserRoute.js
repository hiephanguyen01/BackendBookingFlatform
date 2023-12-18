const express = require("express");
const {
  getAllBookingUser,
  updateBookingUser,
  getBookingUserById,
  filterBookingUser,
  createBookingUser,
  loginByPhoneNumber,
  me,
  updateMe,
  likeStudioPost,
  getLikedPostByUserId,
  deleteMe,
  socialAccountLink,
  cancelSocialAccountLink,
  verifyEmail,
  genCode,
  checkCode,
  logout,
  zaloLink,
} = require("../controllers/bookingUser");
const {
  createRecentlyWatched,
  getRecentlyWatched,
} = require("../controllers/recentlyWatched");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");

const router = express.Router();
router.post("/gen-code", genCode);
router.post("/verify-code", checkCode);
router.get("/verify/:token", verifyEmail);
router.post("/recently-watch", jwtAuth, createRecentlyWatched);
router.get("/recently", jwtAuth, getRecentlyWatched);
router.patch("/updateMe", jwtAuth, upload.single("Image"), updateMe);
router.patch("/deleteMe", jwtAuth, deleteMe);
router.post("/login", loginByPhoneNumber);
router.get("/logout", jwtAuth, logout);
router.get("/me", jwtAuth, me);
router.get("/", getAllBookingUser);

router.patch(
  "/:id",
  jwtAuth,
  authorize({ customerAccount: 3 }),

  updateBookingUser
);
router.post(
  "/filter",
  jwtAuth,
  authorize({ customerAccount: 2 }),
  filterBookingUser
);
router.post("/", createBookingUser);
router.post("/social-account-link", jwtAuth, socialAccountLink);
router.post("/cancel-social-account-link", jwtAuth, cancelSocialAccountLink);
router.post("/zalo-link", jwtAuth, zaloLink);
router.post("/like-studio-post", jwtAuth, likeStudioPost);
router.post("/liked-studio", jwtAuth, getLikedPostByUserId);

router.get("/:id", getBookingUserById);
module.exports = {
  router,
};
