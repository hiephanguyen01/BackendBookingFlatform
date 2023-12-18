const { Love, Post } = require("../models");
const { createWebHook } = require("../utils/WebHook");

const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const moment = require("moment");
const {
  createWebHookEvents,
  createWebHookSendAttempts,
} = require("./adminWebhook");
exports.createLove = catchAsync(async (req, res) => {
  const { PostId, UserId, PostType } = req.body;
  const exits = await Love.findOne({
    where: {
      PostId,
      UserId,
    },
  });
  if (exits) {
    await Love.destroy({
      where: {
        id: exits.id,
      },
    });
    const countLove = await Love.count({ where: { PostId: PostId } });
    await Post.update({ TotalLikes: countLove }, { where: { id: PostId } });
    return res.status(200).send({ ...exits.dataValues });
  }
  if (!PostId) {
    throw new ApiError(500, "PostId is required");
  }
  const love = await Love.create({
    UserId,
    PostId,
    PostType,
  });
  

  createWebHookEvents(req, { Data: love });
  createWebHookSendAttempts();
  const countLove = await Love.count({ where: { PostId: PostId } });
  await Post.update({ TotalLikes: countLove }, { where: { id: PostId } });
  return res.status(200).send(love);
});

exports.getLovesByPostId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const Loves = await Love.findAll({
    where: {
      PostId: id,
    },
  });
  res.status(200).json({
    success: true,
    data: Loves,
  });
});

exports.getLovesByUserId = catchAsync(async (req, res) => {
  const { userId } = req.query;
  const Loves = await Love.findAll({
    where: {
      UserId: userId,
    },
  });

  res.status(200).json({
    success: true,
    data: Loves,
  });
});
