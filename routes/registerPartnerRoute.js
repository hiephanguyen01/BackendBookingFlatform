const express = require("express");
const {
  getAllRegisterPartner,
  getPartnerById,
  updatePartnerById,
  filterPartner,
  getPartnerByTenantId,
  searchRegisterPartner,
  PartnerRegister,
  PartnerLogin,
  PartnerLoginMe,
  checkCode,
  genCodePartner,
  updatePass,
} = require("../controllers/registerPartner");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/", jwtAuth, getAllRegisterPartner);
router.get("/me/me", PartnerLoginMe);
router.post("/register", PartnerRegister);
router.post("/login", PartnerLogin);
router.post("/code", checkCode);
router.get("/code", genCodePartner);
router.get("/search", searchRegisterPartner);
router.get("/:id", getPartnerById);
router.get("/byTenant/:id", getPartnerByTenantId);
router.patch("/pass", updatePass);
router.patch(
  "/update/:id",
  jwtAuth,
  authorize({ partnerAccount: 3 }),
  upload.fields([
    {
      name: "ImageGPKD1",
      maxCount: 1,
    },
    {
      name: "ImageGPKD2",
      maxCount: 1,
    },
    {
      name: "ImageCCCD1",
      maxCount: 1,
    },
    {
      name: "ImageCCCD2",
      maxCount: 1,
    },
  ]),
  updatePartnerById
);
router.post(
  "/filter",
  jwtAuth,
  authorize({ partnerAccount: 2 }),
  filterPartner
);

module.exports = { router };
