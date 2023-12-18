const { HotKey } = require("../models");
const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");

exports.getHotKeyList = catchAsync(async (req, res) => {
  const list = await HotKey.findAll({
    where: {
      name: {
        [Op.like]: req?.query?.name ? `%${req.query.name}%` : "%",
      },
    },
    order: [["createdAt", "DESC"]],
  });
  res.status(200).send(list);
});

exports.getDetailHotKey = catchAsync(async (req, res) => {
  const { id } = req.params;
  const item = await HotKey.findByPk(id);
  if (!item) throw new ApiError(404, "không tồn tại");
  res.status(200).send(item);
});

exports.addHotKey = catchAsync(async (req, res) => {
  const check = await HotKey.findOne({
    where: {
      name: req.body.name,
    },
  });
  if (check) throw new ApiError(500, "Hot key đã được tạo");
  const newHotKey = await HotKey.create(req.body);
  res.status(200).send(newHotKey);
});

exports.deleteHotKey = catchAsync(async (req, res) => {
  const { id } = req.params;
  await HotKey.destroy({
    where: {
      id,
    },
  });
  res.status(200).send(true);
});
exports.updateHotKey = catchAsync(async (req, res) => {
  const { id } = req.params;
  const check = await HotKey.findOne({
    where: {
      name: req.body.name,
      id: {
        [Op.not]: +id,
      },
    },
  });
  if (check) throw new ApiError(500, "Hot key đã tồn tại");
  await HotKey.update(req.body, {
    where: {
      id,
    },
  });
  res.status(200).send(true);
});
