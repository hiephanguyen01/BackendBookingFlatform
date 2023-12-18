const { Op } = require("sequelize");
const catchAsync = require("../middlewares/async");
const { PartnerHubTrendNews } = require("../models");
const ApiError = require("../utils/ApiError");

exports.getAllPartnerHubTrendNews = catchAsync(async (req, res) => {
  const { search } = req.query;
  const list = await PartnerHubTrendNews.findAll({
    where: {
      [Op.or]: {
        title: {
          [Op.like]: search ? `%${search}%` : "%%",
        },
        content: {
          [Op.like]: search ? `%${search}%` : "%%",
        },
      },
    },
  });
  res.status(200).json({
    success: true,
    data: list,
  });
});

exports.getPartnerHubTrendNewsById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const item = await PartnerHubTrendNews.findByPk(id);
  if (!item) {
    throw new ApiError(404, "PartnerHubTrendNews not found");
  }
  res.status(200).json({
    success: true,
    data: item,
  });
});

exports.getPartnerHubTrendNewsById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const item = await PartnerHubTrendNews.findByPk(id);
  const list = await PartnerHubTrendNews.findAll({
    where: {
      id: {
        [Op.ne]: id,
      },
    },
    order: [["createdAt", "DESC"]],
    limit: 4,
  });
  if (!item) {
    throw new ApiError(404, "PartnerHubTrendNews not found");
  }
  res.status(200).json({
    success: true,
    data: item,
    list,
  });
});

exports.createPartnerHubTrendNews = catchAsync(async (req, res) => {
  const { image, content, title, isVisible, category } = req.body;
  const adminId = req.user.id;
  await PartnerHubTrendNews.create({
    image,
    content,
    title,
    isVisible,
    adminId,
    category,
    like: 0,
    dislike: 0,
  });
  res.status(200).json({
    success: true,
  });
});

exports.updatePartnerHubTrendNews = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { image, content, title, isVisible, category } = req.body;
  const adminId = req.user.id;
  await PartnerHubTrendNews.update(
    { image, content, title, isVisible, adminId, category },
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

exports.deletePartnerHubTrendNews = catchAsync(async (req, res) => {
  const { deleteList } = req.body;
  await PartnerHubTrendNews.destroy({
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
  const item = await PartnerHubTrendNews.findOne({
    where: {
      id,
    },
    raw: true,
  });
  if (type === 1) {
    await PartnerHubTrendNews.update(
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
    await PartnerHubTrendNews.update(
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
