const catchAsync = require("../middlewares/async");
const { AffiliatePayment, AffiliateUser } = require("../models");
const ApiError = require("../utils/ApiError");
const { Op, where } = require("sequelize");
const moment = require("moment");
const {
  downloadAffExcel,
  downloadAffUserExcel,
} = require("./exportDataController");

exports.all = catchAsync(async (req, res) => {
  const { option } = req.query;
  let condition;
  if (option) {
    condition = {
      period: {
        [Op.between]: [
          moment().year(option).utc().startOf("year"),
          moment().year(option).utc().endOf("year"),
        ],
      },
    };
  }
  const data = await AffiliatePayment.findAll({
    where: {
      accumulatedUnpaidCommissions: {
        [Op.not]: 0,
      },
      AffiliateUserId: req.user.id,
      ...condition,
    },
  });
  res.json(data);
});
exports.allAdmin = catchAsync(async (req, res) => {
  const { option, keySearch } = req.query;
  let condition;
  if (option) {
    condition = {
      period: {
        [Op.between]: [
          moment(option, "MM/YYYY").utc().startOf("month"),
          moment(option, "MM/YYYY").utc().endOf("month"),
          ,
        ],
      },
    };
  }

  const data = await AffiliatePayment.findAll({
    where: {
      ...condition,
      AffiliateUserId: {
        [Op.like]: keySearch ? `%${keySearch}%` : "%%",
      },
      accumulatedUnpaidCommissions: {
        [Op.not]: 0,
      },
    },
    include: {
      model: AffiliateUser,
      attributes: ["id", "isPersonal"],
    },
  });
  res.json(data);
});
exports.allAdminExport = catchAsync(async (req, res) => {
  const { option } = req.query;
  let condition;
  if (option) {
    condition = {
      period: {
        [Op.between]: [
          moment(option, "MM/YYYY").utc().startOf("month"),
          moment(option, "MM/YYYY").utc().endOf("month"),
          ,
        ],
      },
    };
  }
  let data = await AffiliatePayment.findAll({
    where: {
      ...condition,
    },
    include: {
      model: AffiliateUser,
      attributes: ["id", "isPersonal"],
    },
    raw: true,
  });
  if (!data.length) {
    throw new ApiError(404, "No data");
  }
  data = data.map((val) => ({
    ...val,
    isPersonal: val["AffiliateUser.isPersonal"] ? "Cá nhân" : "Doanh nghiệp",
    payDate: moment(val.payDate).format("DD/MM/YYYY"),
    payStatus: val.payStatus ? "Đã thanh toán" : "Chưa thanh toán",
  }));

  downloadAffExcel(data, res);
});
exports.allExport = catchAsync(async (req, res) => {
  const { option } = req.query;
  const { userId } = req.params;
  let condition;
  if (option) {
    condition = {
      period: {
        [Op.between]: [
          moment().year(option).utc().startOf("year"),
          moment().year(option).utc().endOf("year"),
        ],
      },
    };
  }

  let data = await AffiliatePayment.findAll({
    where: {
      AffiliateUserId: +userId,
      ...condition,
    },
    raw: true,
  });

  if (!data.length) {
    throw new ApiError(404, "No data");
  }

  data = data.map((val) => ({
    ...val,
    payDate: moment(val.payDate).format("DD/MM/YYYY"),
    period: moment(val.period).format("MM/YYYY"),
    year: moment(val.period).format("YYYY"),
    payStatus: val.payStatus ? "Đã thanh toán" : "Chưa thanh toán",
  }));

  downloadAffUserExcel(data, res);
});
exports.paid = catchAsync(async (req, res) => {
  const { id } = req.query;

  let data = await AffiliatePayment.findOne({
    where: {
      id,
    },
    raw: true,
  });

  await AffiliatePayment.update(
    {
      payStatus: data.payStatus ? 0 : 1,
    },
    {
      where: {
        id,
      },
    }
  );

  res.send(true);
});
