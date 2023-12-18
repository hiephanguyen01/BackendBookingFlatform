const { Op } = require("sequelize");
const catchAsync = require("../middlewares/async");
const {
  PartnerHubSolution,
  PartnerHubSupport,
  PartnerHubTrendNews,
} = require("../models");
const ApiError = require("../utils/ApiError");

exports.getAllPartnerHubSolution = catchAsync(async (req, res) => {
  const list = await PartnerHubSolution.findAll();
  res.status(200).json({
    success: true,
    data: list,
  });
});

exports.getPartnerHubSolutionById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const item = await PartnerHubSolution.findByPk(id);
  if (!item) {
    throw new ApiError(404, "PartnerHubSolution not found");
  }
  res.status(200).json({
    success: true,
    data: item,
  });
});
exports.getPartnerHubSolutionById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const item = await PartnerHubSolution.findByPk(id);
  const list = await PartnerHubSolution.findAll({
    where: {
      id: {
        [Op.ne]: id,
      },
    },
    order: [["createdAt", "DESC"]],
    limit: 4,
  });
  if (!item) {
    throw new ApiError(404, "PartnerHubSolution not found");
  }
  res.status(200).json({
    success: true,
    data: item,
    list,
  });
});

exports.createPartnerHubSolution = catchAsync(async (req, res) => {
  const { image, content, title, isVisible } = req.body;
  const adminId = req.user.id;
  await PartnerHubSolution.create({
    image,
    content,
    title,
    isVisible,
    adminId,
    like: 0,
    dislike: 0,
  });
  res.status(200).json({
    success: true,
  });
});

exports.updatePartnerHubSolution = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { image, content, title, isVisible } = req.body;
  const adminId = req.user.id;
  await PartnerHubSolution.update(
    { image, content, title, isVisible, adminId },
    {
      where: {
        id,
      },
    }
  );
  res.status(200).json({
    success: true,
  });
});

exports.deletePartnerHubSolution = catchAsync(async (req, res) => {
  const { deleteList } = req.body;
  await PartnerHubSolution.destroy({
    where: {
      id: deleteList,
    },
  });
  res.status(200).json({
    success: true,
  });
});

exports.like = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { type = 1 } = req.body;
  const item = await PartnerHubSolution.findOne({
    where: {
      id,
    },
    raw: true,
  });
  if (type === 1) {
    await PartnerHubSolution.update(
      {
        like: item.like + 1,
      },
      {
        where: {
          id,
        },
      }
    );
  } else {
    await PartnerHubSolution.update(
      {
        dislike: item.dislike + 1,
      },
      {
        where: {
          id,
        },
      }
    );
  }
  res.status(200).json({
    success: true,
  });
});

exports.getAllPartnerHubHome = catchAsync(async (req, res) => {
  const solutions = await PartnerHubSolution.findAll({
    order: [["createdAt", "DESC"]],
    limit: 10,
  });
  const supports = await PartnerHubSupport.findAll({
    order: [["createdAt", "DESC"]],
    limit: 6,
  });
  const trends = await PartnerHubTrendNews.findAll({
    order: [["createdAt", "DESC"]],
    limit: 10,
  });
  res.status(200).json({
    success: true,
    solutions,
    supports,
    trends,
  });
});
