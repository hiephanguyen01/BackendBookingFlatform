const { FlowWebhook } = require("../models");
const catchAsync = require("../middlewares/async");
const baseController = require("../utils/BaseController");
exports.getAllFlowWebhooks = catchAsync(async (req, res) => {
  const data = await FlowWebhook.findAll();
  res.status(200).json({
    success: true,
    data,
  });
});

exports.createFlowWebhook = catchAsync(async (req, res) => {
  const obj = baseController.filterObj(req.body, "Name");
  const data = await FlowWebhook.create(obj);
  res.status(200).json({
    success: true,
    data,
  });
});

exports.updateFlowWebhook = catchAsync(async (req, res) => {
  const obj = baseController.filterObj(req.body, "Name");
  const data = await FlowWebhook.update(obj, { where: { id: req.params.id } });
  res.status(200).json({
    success: true,
  });
});

exports.deleteFlowWebhook = catchAsync(async (req, res) => {
  const data = await FlowWebhook.destroy({ where: { id: req.params.id } });
  res.status(200).json({
    success: true,
  });
});
