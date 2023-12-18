const { MailService } = require("../models");
const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");
const MailSevice = require("../utils/MailService");

exports.all = catchAsync(async (req, res) => {
  const list = await MailService.findAll();
  res.status(200).send(list);
});
exports.create = catchAsync(async (req, res) => {
  const check = await MailService.findOne({
    where: {
      user: req.body.user,
    },
  });
  if (check) {
    throw new ApiError(500, "Deplicate email");
  }

  const list = await MailService.create(req.body);

  res.status(200).send(list);
});
exports.destroy = catchAsync(async (req, res) => {
  await MailService.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).send(true);
});
exports.edit = catchAsync(async (req, res) => {
  await MailService.update(
    {
      ...req.body,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  res.status(200).send(true);
});
exports.activate = catchAsync(async (req, res) => {
  const { id } = req.params;
  await MailService.update(
    {
      isActivate: false,
    },
    {
      where: {
        id: {
          [Op.not]: null,
        },
      },
    }
  );
  await MailService.update(
    {
      isActivate: true,
    },
    {
      where: {
        id: +id,
      },
    }
  );
  await MailSevice.init();
  res.status(200).send(true);
});
