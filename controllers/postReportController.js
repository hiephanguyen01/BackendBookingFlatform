const { createWebHook } = require("../utils/WebHook");
const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const moment = require("moment");
const { PostReport, BookingUser } = require("../models");
const baseController = require("../utils/BaseController");

exports.createReport = catchAsync(async (req, res) => {
  const { Category, PostId, Content } = req.body;
  if (!PostId || !Content || !Category) {
    throw new ApiError(500, "PostId && Content && Category is required");
  }
  const BookingUserId = req.user.id;
  const data = await PostReport.create({
    Category,
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
  const data = await baseController.Pagination(
    PostReport,
    page,
    limit,
    {},
    {
      model: BookingUser,
    }
  );
  res.status(200).json(data);
});

exports.getReportById = catchAsync(async (req, res) => {
  const { Id } = req.params;
  const data = await PostReport.findByPk(Id, {
    include: {
      model: BookingUser,
    },
  });
  res.status(200).json(data);
});

exports.deleteReport = catchAsync(async (req, res) => {
  const { Id } = req.params;
  const data = await PostReport.destroy({
    where: { Id },
  });
  res.status(200).json({
    success: true,
  });
});
