const express = require("express");
const {
  statistic,
  statisticDetail,
  getAllOrdersAffiliate,
  getOrderAffiliate,
  statisticAdmin,
  statisticPublisher,
  getAllComisionsAffiliate,
  exportDataAffiliate,
  statisticProductDetail,
  CommissionAffiliateExport,
  getAllCommissionsAffiliatePublisher,
} = require("../controllers/affiliateStatistics");
const {
  createUserPhoneNumber,
  userWithGoogle,
  loginWithPhoneNumber,
  me,
  updateUser,
  userWithFacebook,
  all,
  details,
  activate,
  genCode,
  checkCode,
  sendRequest,
} = require("../controllers/affiliateUser");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");
const router = express.Router();

router.get("/all", all);
router.get("/details/:userId", details);
router.get("/activate/:userId", activate);
router.get("/me", me);
router.post("/phone/register", createUserPhoneNumber);
router.post("/phone/login", loginWithPhoneNumber);
router.post("/google", userWithGoogle);
router.post("/facebook", userWithFacebook);
router.patch(
  "/",
  jwtAuth,
  upload.fields([
    {
      name: "CCCD1",
      maxCount: 1,
    },
    {
      name: "CCCD2",
      maxCount: 1,
    },
  ]),
  updateUser
);

router.get("/statistics/:id", jwtAuth, statisticDetail);
router.get("/orders", getAllOrdersAffiliate);
router.get("/exports", exportDataAffiliate);
router.get("/commissions/export", CommissionAffiliateExport);
router.get("/commissions", getAllComisionsAffiliate);
router.get(
  "/commissionsPublisher",
  jwtAuth,
  getAllCommissionsAffiliatePublisher
);
router.get("/orders/:id", getOrderAffiliate);
router.get("/statistics", jwtAuth, statistic);
router.get("/admin/statistics-product/:id", statisticProductDetail);
router.get("/admin/statistics-product", statisticAdmin);
router.get("/admin/statistics-publisher", statisticPublisher);
router.get("/gencode", jwtAuth, genCode);
router.post("/checkcode", jwtAuth, checkCode);

router.post("/send-request/:userId", sendRequest);

module.exports = { router };
