const { Op } = require("sequelize");
const catchAsync = require("../middlewares/async");
const { PartnerHubSupport } = require("../models");
const ApiError = require("../utils/ApiError");

exports.getAllPartnerHubSupport = catchAsync(async (req, res) => {
  const list = await PartnerHubSupport.findAll();
  res.status(200).json({
    success: true,
    data: list,
  });
});

exports.getPartnerHubSupportById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const item = await PartnerHubSupport.findByPk(id);
  if (!item) {
    throw new ApiError(404, "PartnerHubSupport not found");
  }
  res.status(200).json({
    success: true,
    data: item,
  });
});

exports.getPartnerHubSupportById2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const item = await PartnerHubSupport.findByPk(id);
  const list = await PartnerHubSupport.findAll({
    where: {
      id: {
        [Op.ne]: id,
      },
    },
    order: [["createdAt", "DESC"]],
    limit: 4,
  });
  if (!item) {
    throw new ApiError(404, "PartnerHubSupport not found");
  }
  res.status(200).json({
    success: true,
    data: item,
    list,
  });
});

exports.createPartnerHubSupport = catchAsync(async (req, res) => {
  const { image, content, title, isVisible } = req.body;
  const adminId = req.user.id;
  await PartnerHubSupport.create({
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

exports.updatePartnerHubSupport = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { image, content, title, isVisible } = req.body;
  const adminId = req.user.id;
  await PartnerHubSupport.update(
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

exports.deletePartnerHubSupport = catchAsync(async (req, res) => {
  const { deleteList } = req.body;
  await PartnerHubSupport.destroy({
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
  const item = await PartnerHubSupport.findOne({
    where: {
      id,
    },
    raw: true,
  });
  if (type === 1) {
    await PartnerHubSupport.update(
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
    await PartnerHubSupport.update(
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
