const md5 = require("md5");
const catchAsync = require("../middlewares/async");
const { AdminAccount } = require("../models");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

exports.createAdmin = catchAsync(async (req, res) => {
  const { username } = req.body;
  const check = await AdminAccount.findOne({
    where: {
      username,
    },
  });
  if (check) {
    throw new ApiError(500, "Username existed");
  }
  const user = await AdminAccount.create({
    ...req.body,
    password: md5(req.body.password),
    partnerAccount: 1,
    customerAccount: 1,
    post: 1,
    report: 1,
    booking: 1,
    export: 1,
    dao: 1,
    permission: 1,
    notification: 1,
    promo: 1,
    setting: 1,
    affiliate: 1,
    chat: 1,
    dashboard: 1,
  });
  res.status(200).json({
    success: true,
    user,
  });
});
exports.getAll = catchAsync(async (req, res) => {
  const { keySearch } = req.query;
  const users = await AdminAccount.findAll({
    where: {
      [Op.or]: {
        name: {
          [Op.like]: keySearch ? `%${keySearch}%` : "%",
        },
        phone: {
          [Op.like]: `%${keySearch}%`,
        },
      },
    },
  });
  res.status(200).json({
    success: true,
    users,
  });
});
exports.me = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const data = jwt.verify(token, process.env.SECRET);
  const user = await AdminAccount.findByPk(data.id);
  res.json({
    success: true,
    user: user,
  });
});
exports.getById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await AdminAccount.findByPk(id);
  if (!user) {
    throw new ApiError(404, "not found");
  }
  res.status(200).json({
    success: true,
    user,
  });
});
exports.login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const user = await AdminAccount.findOne({
    where: {
      username,
      password: md5(password),
    },
  });
  const token = jwt.sign(user.dataValues, process.env.SECRET, {
    expiresIn: 86164,
  });
  if (!user) {
    throw new ApiError(404, "not found");
  }
  res.status(200).json({
    success: true,
    user,
    token,
  });
});
exports.update = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AdminAccount.update(
    {
      ...req.body,
    },
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
exports.deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AdminAccount.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({
    success: true,
  });
});
