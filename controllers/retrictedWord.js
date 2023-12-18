const { RestrictedWord } = require("../models");
const { Op } = require("sequelize");
const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const baseController = require("../utils/BaseController");
const moment = require("moment");

exports.getRestrictedWordsList = catchAsync(async (req, res) => {
  const { textSearch } = req.query;
  const list = await RestrictedWord.findAll({
    where: { Value: { [Op.substring]: textSearch } },
  });
  res.status(200).json({
    success: true,
    data: list,
  });
});
exports.getDetailRestrictedWord = catchAsync(async (req, res) => {
  const { id } = req.params;
  const item = await RestrictedWord.findOne({
    where: {
      id,
    },
  });
  if (item) {
    res.status(200).send(item);
  } else {
    res.status(404).send("not found");
  }
});
exports.addRestrictedWord = catchAsync(async (req, res) => {
  const { Value, Description = "" } = req.body;
  const newRestrictedWord = await RestrictedWord.create({
    Value,
    Description,
    CreatorUserId: 1,
    CreationTime: moment(),
    IsDeleted: 0,
  });
  res.status(200).send(newRestrictedWord);
});

exports.deleteRestrictedWord = catchAsync(async (req, res) => {
  const { id } = req.params;
  const check = await RestrictedWord.findOne({
    where: {
      id,
    },
  });
  if (!check) throw new ApiError(400, "Fail");
  await RestrictedWord.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({
    success: true,
  });
});

exports.deleteAllRestrictedWord = catchAsync(async (req, res) => {
  await RestrictedWord.destroy({
    where: {},
    truncate: true,
  });
  res.status(200).json({
    success: true,
  });
});

exports.updateRestrictedWord = catchAsync(async (req, res) => {
  const { id } = req.params;
  const check = await RestrictedWord.findOne({
    where: {
      id,
    },
  });
  if (!check) throw new ApiError(400, "Fail");
  await RestrictedWord.update(
    { ...req.body, LastModificationTime: moment() },
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
