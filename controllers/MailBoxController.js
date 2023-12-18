const { MailBox } = require("../models");
const { AppBinaryObject } = require("../models");

const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const { Op, where } = require("sequelize");
const baseController = require("../utils/BaseController");
const moment = require("moment");

exports.getAllMailBox = catchAsync(async (req, res) => {
  let { page = 1, limit = 10, status = "", createdAt = [] } = req.query;
  createdAt =
    createdAt.length > 0
      ? createdAt.map((item) => moment(item).startOf("day"))
      : [];
  console.log(status, createdAt);
  const list = await baseController.Pagination(MailBox, page, limit, {
    where: {
      status: status ? Boolean(Number(status)) : { [Op.in]: [true, false] },
      createdAt: { [Op.between]: createdAt.length ? createdAt : [1, moment()] },
    },
  });
  res.status(200).json(list);
});

exports.getMailById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const mail = await MailBox.findByPk(id);
  if (!mail) {
    throw new ApiError(404, "banner not found");
  }
  res.status(200).json({
    success: true,
    data: mail,
  });
});

exports.createMail = catchAsync(async (req, res) => {
  await MailBox.create({ ...req.body, status: 0, isFeedback: 0 });
  res.status(200).json({
    success: true,
  });
});

exports.updateMail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, isFeedback } = req.body;
  const mail = await MailBox.findByPk(id);
  if (!mail) {
    throw new ApiError(404, "Mail not found");
  }
  await MailBox.update(
    {
      status: status,
      isFeedback: isFeedback,
    },
    {
      where: {
        id,
      },
    }
  );
  res.status(200).json({
    success: true,
    message: "update success",
  });
});
// exports.deleteBanner = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   const banner = await Banner.findByPk(id);
//   if (!banner) {
//     throw new ApiError(404, "banner not found");
//   }
//   await Banner.destroy({
//     where: {
//       id,
//     },
//   });
//   await AppBinaryObject.destroy({
//     where: {
//       id: String(banner.dataValues.Image),
//     },
//   });
//   const banners = await Banner.findAll({
//     where: { Priority: { [Op.gt]: banner.dataValues.Priority } },
//   });

//   await Promise.all(
//     banners.map(async (item) =>
//       Banner.increment({ Priority: -1 }, { where: { id: item.dataValues.id } })
//     )
//   );
//   res.status(200).json({
//     success: true,
//     message: "delete success",
//   });
// });
