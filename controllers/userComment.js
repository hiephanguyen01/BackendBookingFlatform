const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const { UserComment } = require("../models");

exports.createComment = catchAsync(async (req, res) => {
  const { Content } = req.body;
  if (!Content) {
    throw new ApiError(500, "Content is required");
  }
  const data = await UserComment.create({
    Content,
  });
  res.status(200).json({
    success: true,
    data,
  });
});
exports.getAllComment = catchAsync(async (req, res) => {
  const data = await UserComment.findAll({});
  res.status(200).json(data);
});

exports.getCommentById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await UserComment.findByPk(id);
  res.status(200).json(data);
});

exports.updateComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { Content } = req.body;
  await UserComment.update(
    { Content },
    {
      where: { id },
    }
  );
  res.status(200).json({
    success: true,
  });
});
exports.deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  await UserComment.destroy({
    where: { id },
  });
  res.status(200).json({
    success: true,
  });
});
