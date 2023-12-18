const ApiError = require("../utils/ApiError");
const catchAsync = require("./async");
const { AdminAccount } = require("../models");

exports.authorize = (require) =>
  catchAsync(async (req, res, next) => {
    const key = Object.keys(require)[0];
    const id = req.user.id;
    const raw = await AdminAccount.findByPk(id);
    const user = raw.dataValues;
    if (user[key] < require[key]) {
      throw new ApiError(403, "Access denied");
    }
    next();
  });
