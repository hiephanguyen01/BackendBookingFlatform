const express = require("express");
const {
  createSaleCode,
  getAllSaleCode,
  getDetailSaleCode,
  deleteSaleCode,
  updateSaleCode,
  getSaleCodeByTenantId,
  getMySaleCode,
  savePromoCode,
  cancelSavePromoCode,
  getSaleCodeByTenantIdExceptUserSave,
  customerJoinedByPromo,
  partnerJoinedByPromo,
  confirmSaleCode,
  exportSaleCode,
  exportPartnerPromo,
  getAllSaleCodeByPartner,
} = require("../controllers/promoCode");
const { authorize } = require("../middlewares/authorize");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.get("/customer-joined", customerJoinedByPromo);
router.get("/partner-joined", partnerJoinedByPromo);
router.post("/", jwtAuth, authorize({ promo: 3 }), createSaleCode);
router.get("/verify/:token", confirmSaleCode);
router.get("/export", exportSaleCode);
router.get("/partners/export/:promoId", exportPartnerPromo);

router.post("/save-code", jwtAuth, savePromoCode);
router.delete("/cancel-save-code/:PromoteCodeId", jwtAuth, cancelSavePromoCode);
router.get("/me", jwtAuth, getMySaleCode);
router.get("/by-tenant-id", jwtAuth, getSaleCodeByTenantId);

router.get("/byPartner", getAllSaleCodeByPartner);


router.get("/", jwtAuth, authorize({ promo: 2 }), getAllSaleCode);
router.get("/:id", jwtAuth, authorize({ promo: 2 }), getDetailSaleCode);
router.delete("/:id", jwtAuth, authorize({ promo: 3 }), deleteSaleCode);
router.patch("/:id", jwtAuth, authorize({ promo: 3 }), updateSaleCode);

module.exports = { router };
