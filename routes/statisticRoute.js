const express = require("express");
const {
  getLasttest,
  getByDate,
  getLastWeek,
  getWeekDataByDate,
  getLastManyDay,
  getLastMonth,
  getBySpecifyDate,
  getCount,
  getDataPartnerCustomer,
  getAffiliateData,
  getAffiliateDataVer2,
  getPartnerData,
  getPartnerDataBarChart,
} = require("../controllers/statisticController");
const { jwtAuth } = require("../middlewares/jwtAuth");

const router = express.Router();

router.get("/lasttest", getLasttest);
router.get("/lasttest-week", getLastWeek);
router.get("/weekbydate", getWeekDataByDate);
router.get("/bydate", getByDate);
router.get("/get-limit-date", getLastManyDay);
router.get("/get-last-month", getLastMonth);
router.get("/get-specify-day", getBySpecifyDate);
//new
router.get("/get-total-all", getCount);
router.get("/get-partner-customer", getDataPartnerCustomer);
router.get("/get-affiliate-statistic", jwtAuth, getAffiliateData);
router.get("/get-affiliate-statistic-admin", getAffiliateData);

router.get("/get-affiliate-statistic-2", jwtAuth, getAffiliateDataVer2);
router.get("/get-affiliate-statistic-admin-2", getAffiliateDataVer2);

router.get("/get-partner-statistic", getPartnerDataBarChart);

module.exports = { router };
