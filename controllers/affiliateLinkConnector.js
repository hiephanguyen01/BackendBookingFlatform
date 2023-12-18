const catchAsync = require("../middlewares/async");
const { AffiliateAccessCount } = require("../models");

exports.createAccessCount = catchAsync(async (req, res) => {
  const { AffiliateUserId, IpAddress } = req.body;
  await AffiliateAccessCount.create({ AffiliateUserId, IpAddress });
  res.status(201).json({ status: "success" });
});
