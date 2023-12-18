const { AdminNotificationKey, AdminNotificationSig } = require("../models");
const catchAsync = require("../middlewares/async");
// const moment = require("moment");
// const { createWebHook } = require("../utils/WebHook");

exports.updateAdminNotificationKey = catchAsync(async (req, res) => {
  const { GoogleApiFCM, AuthKey, P12Password, P12BundleId } = req.body;
  await AdminNotificationKey.update(
    {
      GoogleApiFCM,
      AuthKey,
      P12Certificate: req.file.buffer,
      P12Password,
      P12BundleId,
    },
    { where: { id: 1 } }
  );
  res.status(200).json({
    success: true,
    message: "Updated",
  });
});
exports.getAllNotification = catchAsync(async (req, res) => {
  const { q = "" } = req.query;
  const data = await AdminNotificationSig.findAll({
    order: [["createdAt", "DESC"]],
    where: {
      type: q,
    },
  });
  res.status(200).json(data);
});
exports.updateReaded = catchAsync(async (req, res) => {
  const data = await AdminNotificationSig.update(
    {
      isReaded: true,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  res.status(200).json(data);
});
