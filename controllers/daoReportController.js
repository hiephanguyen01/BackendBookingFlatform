const { createWebHook } = require("../utils/WebHook");
const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const moment = require("moment");
const { DaoReport, BookingUser, Post } = require("../models");
const baseController = require("../utils/BaseController");

exports.createReport = catchAsync(async (req, res) => {
  const { PostId, Content } = req.body;
  if (!PostId || !Content) {
    throw new ApiError(500, "PostId && Content is required");
  }
  const BookingUserId = req.user.id;
  const data = await DaoReport.create({
    PostId,
    Content,
    BookingUserId,
  });
  res.status(200).json({
    success: true,
    data,
  });
});

exports.getAllReport = catchAsync(async (req, res) => {
  const { page, limit } = req.params;
  const data = await baseController.Pagination(DaoReport, page, limit);
  res.status(200).json(data);
});

exports.getReportById = catchAsync(async (req, res) => {
  const { Id } = req.params;
  const data = await DaoReport.findByPk(Id, {
    include: [
      {
        model: Post,
      },
      { model: BookingUser },
    ],
  });
  res.status(200).json(data);
});

exports.deleteReport = catchAsync(async (req, res) => {
  const { Id } = req.params;
  await DaoReport.destroy({
    where: { Id },
  });
  res.status(200).json({
    success: true,
  });
});
