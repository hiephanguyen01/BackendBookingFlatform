const { Bank } = require("../models");
const { AppBinaryObject } = require("../models");

const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");

exports.getAllBank = catchAsync(async (req, res) => {
  const list = await Bank.findAll({ order: [["BusinessName", "ASC"]] });
  res.status(200).json({
    success: true,
    data: list,
  });
});

exports.getBankById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const bank = await Bank.findByPk(id);
  if (!bank) {
    throw new ApiError(404, "banks not found");
  }
  res.status(200).json({
    success: true,
    data: bank,
  });
});

exports.createBank = catchAsync(async (req, res) => {
  const { EngName, VNName, BusinessName, Url, Address } = req.body;

  const list = await Bank.create({
    EngName,
    VNName,
    BusinessName,
    Url,
    Address,
  });
  res.status(200).json({
    success: true,
    data: list,
  });
});

exports.updateBank = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { EngName, VNName, BusinessName, Url, Address } = req.body;
  const bank = await Bank.findByPk(id);
  if (!bank) {
    throw new ApiError(404, "bank not found");
  }
  await Bank.update(
    { EngName, VNName, BusinessName, Url, Address },
    {
      where: {
        id,
      },
    }
  );

  const newBank = await Bank.findByPk(id);
  res.status(200).json({
    success: true,
    message: "update success",
    data: newBank,
  });
});
exports.deleteBank = catchAsync(async (req, res) => {
  const { id } = req.params;
  const bank = await Bank.findByPk(id);
  if (!bank) {
    throw new ApiError(404, "bank not found");
  }
  await Bank.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({
    success: true,
    message: "delete success",
  });
});
