const {
  SaleCode: Code,
  PromoteCode_Partner,
  RegisterPartner,
  PromoteCode_UserSave,
  BookingUser,
  StudioBooking,
  PhotographerBooking,
} = require("../models");
const jwt = require("jsonwebtoken");
const catchAsync = require("../middlewares/async");
const moment = require("moment");
const { createWebHook } = require("../utils/WebHook");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");
const baseController = require("../utils/BaseController");
const MailSevice = require("../utils/MailService");
const { randomBytes, scrypt, createHash } = require("crypto");
const { promisify } = require("util");
const {
  downloadSaleCodeExcel,
  downloadSaleCodePartnerExcel,
} = require("./exportDataController");
const { convertTimeUTC, convertTime } = require("../utils/convert");
const { promises } = require("readline");
const scryptAsync = promisify(scrypt);

exports.getAllSaleCode = catchAsync(async (req, res) => {
  let { saleCode, dateTimeApply, dateTimeExpire, status, page, limit } =
    req.query;
  dateTimeApply = JSON.parse(dateTimeApply);
  dateTimeExpire = JSON.parse(dateTimeExpire);
  let dateCondition;
  switch (+status) {
    case 1:
      dateCondition = {
        DateTimeApply: {
          [Op.gte]: dateTimeApply?.startDate
            ? moment(dateTimeApply.endDate).endOf("day")
            : 1,
          [Op.lte]: moment(),
        },
        DateTimeExpire: {
          [Op.lte]: dateTimeExpire?.endDate
            ? moment(dateTimeExpire.endDate).endOf("day")
            : moment().add("year", 1),
          [Op.gte]: dateTimeExpire?.startDate
            ? moment(dateTimeExpire.startDate).startOf("day")
            : moment(),
        },
      };
      break;
    case 2:
      dateCondition = {
        DateTimeExpire: {
          [Op.lte]: moment(),
          [Op.gte]: dateTimeExpire?.startDate
            ? moment(dateTimeExpire.startDate).startOf("day")
            : 1,
        },
      };
      break;
    default:
      dateCondition = {};
      break;
  }
  const condition = {
    where: {
      SaleCode: {
        [Op.substring]: saleCode ? `${saleCode}` : ``,
      },
      DateTimeApply: {
        [Op.gte]: dateTimeApply?.startDate
          ? moment(dateTimeApply.startDate).startOf("day")
          : 1,
        [Op.lte]: dateTimeApply?.endDate
          ? moment(dateTimeApply.endDate).endOf("day")
          : moment().add("years", 1),
      },
      DateTimeExpire: {
        [Op.gte]: dateTimeExpire?.startDate
          ? moment(dateTimeExpire.startDate).startOf("day")
          : 1,
        [Op.lte]: dateTimeExpire?.endDate
          ? moment(dateTimeExpire.endDate).endOf("day")
          : moment().add("years", 1),
      },
      ...dateCondition,
      IsDeleted: +status === 3 ? true : { [Op.or]: [true, false] },
    },
    order: [["createdAt", "DESC"]],
  };
  const list = await baseController.Pagination(Code, page, limit, condition, {
    model: PromoteCode_Partner,
    attributes: ["PartnerId", "PartnerConfirm"],
  });
  const newList = {
    ...list,
    data: list.data.map((item) => {
      return {
        ...item.toJSON(),
        Partners: item.toJSON().PromoteCode_Partners.length,
        PartnerJoined: item
          .toJSON()
          .PromoteCode_Partners.filter(
            (partner) => partner.PartnerConfirm === true
          ).length,
        PromoteCode_Partners: null,
      };
    }),
  };
  res.status(200).json(newList);
});
exports.getAllSaleCodeByPartner = catchAsync(async (req, res) => {
  let {
    saleCode,
    dateTimeApply,
    dateTimeExpire,
    status,
    page,
    limit,
    partnerId,
  } = req.query;
  dateTimeApply = JSON.parse(dateTimeApply);
  dateTimeExpire = JSON.parse(dateTimeExpire);
  let dateCondition;
  switch (+status) {
    case 1:
      dateCondition = {
        DateTimeApply: {
          [Op.gte]: dateTimeApply?.startDate ? dateTimeApply.startDate : 1,
          [Op.lte]: moment(),
        },
        DateTimeExpire: {
          [Op.lte]: dateTimeExpire?.endDate
            ? dateTimeExpire.endDate
            : moment().add("years", 1),
          [Op.gte]: dateTimeExpire?.startDate
            ? dateTimeExpire.startDate
            : moment(),
        },
      };
      break;
    case 2:
      dateCondition = {
        DateTimeExpire: {
          [Op.lte]: moment(),
          [Op.gte]: dateTimeExpire?.startDate ? dateTimeExpire.startDate : 1,
        },
      };
      break;
    default:
      dateCondition = {};
      break;
  }
  let condition = {
    SaleCode: {
      [Op.substring]: saleCode ? `${saleCode}` : ``,
    },
    // DateTimeApply: {
    //   [Op.gte]: dateTimeApply?.startDate ? dateTimeApply.startDate : 1,
    //   [Op.lte]: dateTimeApply?.endDate
    //     ? dateTimeApply.endDate
    //     : moment().add("years", 1),
    // },
    // DateTimeExpire: {
    //   [Op.gte]: dateTimeExpire?.startDate ? dateTimeExpire.startDate : 1,
    //   [Op.lte]: dateTimeExpire?.endDate
    //     ? dateTimeExpire.endDate
    //     : moment().add("years", 1),
    // },
    ...dateCondition,
    IsDeleted: +status === 3 ? true : { [Op.or]: [true, false] },

    // order: [["createdAt", "DESC"]],
  };
  if (dateTimeApply?.startDate || dateTimeApply?.endDate) {
    condition = {
      ...condition,
      DateTimeApply: {
        [Op.or]: [
          {
            [Op.gte]: dateTimeApply?.startDate
              ? moment(dateTimeApply?.startDate).utc().startOf("day")
              : 1,
            [Op.lte]: dateTimeApply?.endDate
              ? moment(dateTimeApply?.endDate).utc().endOf("day")
              : moment().utc(),
          },
        ],
      },
    };
  }
  if (dateTimeExpire?.startDate || dateTimeExpire?.endDate) {
    condition = {
      ...condition,
      DateTimeExpire: {
        [Op.or]: [
          {
            [Op.gte]: dateTimeExpire?.startDate
              ? moment(dateTimeExpire?.startDate).utc().startOf("day")
              : 1,
            [Op.lte]: dateTimeExpire?.endDate
              ? moment(dateTimeExpire?.endDate).utc().endOf("day")
              : moment().utc(),
          },
        ],
      },
    };
  }

  const list = await baseController.Pagination(Code, page, limit, {
    where: { ...condition },
    order: [["createdAt", "DESC"]],
  });
  // const list = await baseController.Pagination(Code, page, limit, condition, {
  //   model: PromoteCode_Partner,
  //   attributes: ["PartnerId", "PartnerConfirm"],
  // });
  const newList = {
    ...list,
    // data: list,
    // data: list.data
    //   .map((item) => {
    //     console.log(item.toJSON().PartnerApply);
    //     if (item?.toJSON()?.PartnerApply?.includes(partnerId)) {
    //       return {
    //         ...item.toJSON(),
    //         Partners: item.toJSON().PromoteCode_Partners.length,
    //         PartnerJoined: item
    //           .toJSON()
    //           .PromoteCode_Partners.filter(
    //             (partner) => partner.PartnerConfirm === true
    //           ).length,
    //         PromoteCode_Partners: null,
    //       };
    //     }
    //   })
    //   .filter((item) => item != null),
  };
  res.status(200).json(newList);
});

exports.getDetailSaleCode = catchAsync(async (req, res) => {
  const { id } = req.params;
  const promoCode = await Code.findOne({
    where: {
      id,
    },
    // include: {
    //   model: PromoteCode_Partner,
    //   attributes: ["PartnerId", "PartnerConfirm"],
    //   include: RegisterPartner,
    // },
  });
  if (!promoCode) {
    return res.status(404).send("not found");
  }
  const countUsed = await StudioBooking.count({ where: { PromoCodeId: id } });
  res.status(200).send({
    ...promoCode.dataValues,
    Category: promoCode.dataValues.Category.split(","),
    countUsed,
  });
});

exports.createSaleCode = catchAsync(async (req, res) => {
  const promoCode = req.body;
  const {
    SaleCode,
    DateTimeApply,
    DateTimeExpire,
    SpendingPartner,
    SpendingBookingStudio,
    Category,
    Confirm,
  } = req.body;

  const check = await Code.findAll({ where: { SaleCode } });
  if (check.length > 0) throw new ApiError(400, "This code was already in use");
  if (Number(SpendingPartner) + Number(SpendingBookingStudio) !== 100) {
    throw new ApiError(
      400,
      "total of spending of partner and spending of company must be equal 100"
    );
  }
  if (!DateTimeApply || !DateTimeExpire || !Category) {
    throw new ApiError(400, "DateTimeApply and DateTimeExpire");
  }
  const newSaleCode = await Code.create({
    ...promoCode,
    // NoOfJoin: 0,
    NoOfJoined: 0,
    PartnerApply: promoCode.PartnerConfirm ? null : promoCode.PartnerJoin,
    PartnerJoin: promoCode.PartnerConfirm ? promoCode.PartnerJoin : null,
  });
  if (promoCode.PartnerConfirm) {
    let idPartner = promoCode.PartnerJoin.split(",").map(Number);
    let listEmail = await RegisterPartner.findAll({
      where: { TenantId: idPartner },
      attributes: ["Email", "Id"],
    });
    try {
      Promise.all(
        listEmail.map(async (email) => {
          const token = jwt.sign(
            { id: email.dataValues.Id, idCode: newSaleCode.id },
            process.env.SECRET
          );

          MailSevice.sendMail(
            email.dataValues.Email,
            "Email Xác Nhận Thông Tin Khuyến Mãi",
            "",

            `${baseController.baseURL}/api/promo-code/verify/${token}`
          );
        })
      );
    } catch (error) {
      console.log("error send mail");
    }
  }
  return res.status(200).json({ success: false, data: newSaleCode });
});

function removeNumber(stri, numberInput) {
  // Chuyển chuỗi thành mảng các số
  let numberArray = stri.split(",").map(Number);

  // Tìm vị trí của số nhập vào trong mảng
  let index = numberArray.indexOf(numberInput);

  // Nếu tìm thấy số, xóa nó khỏi mảng
  if (index !== -1) {
    numberArray.splice(index, 1);
  }

  // Kết nối lại các số còn lại thành chuỗi mới
  let result = numberArray.join(",");

  return result;
}

exports.confirmSaleCode = catchAsync(async (req, res) => {
  let { token } = req.params;
  jwt.verify(token, process.env.SECRET, async (err, user) => {
    if (err) return res.status(404).json("ERR!");
    const data = await Code.findByPk(user.idCode);
    if (data.PartnerJoin.includes(user.id)) {
      if (!(data.PartnerApply || "").includes(user.id)) {
        let update = data.PartnerApply
          ? data.PartnerApply.concat(data.PartnerApply && ",", user.id)
          : `${user.id}`;
        let PartnerJoin = removeNumber(data.PartnerJoin, user.id);
        await Code.update(
          { PartnerApply: update, PartnerJoin },
          {
            where: {
              id: user.idCode,
            },
          }
        );
        res.status(200).json("Thành công!");
      } else {
        res.status(200).json("Đã confirm!");
      }
    } else {
      res.status(200).json("");
    }
  });
});

exports.deleteSaleCode = catchAsync(async (req, res) => {
  const { id } = req.params;
  await PromoteCode_Partner.destroy({
    where: {
      PromoteCodeId: id,
    },
  });
  await Code.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({
    success: true,
  });
});

exports.updateSaleCode = catchAsync(async (req, res) => {
  const { id } = req.params;
  const promoCodeUpdate = req.body;
  const promoCode = await Code.findOne({
    where: {
      id,
    },
  });
  if (!promoCode) {
    throw new ApiError(404, "promoCode not found");
  }
  await Code.update(promoCodeUpdate, {
    where: {
      id,
    },
  });
  res.status(200).json({
    success: true,
  });
});

// exports.getSaleCodeByTenantId = catchAsync(async (req, res) => {
//   const { TenantId } = req.query;
//   const promoCode = await PromoteCode_Partner.findAll({
//     where: {
//       PartnerId: TenantId,
//       PartnerConfirm: true,
//     },
//     include: {
//       model: Code,
//     },
//   });
//   res.status(200).json({
//     success: true,
//     data: promoCode,
//   });
// });

exports.getSaleCodeByTenantId = catchAsync(async (req, res) => {
  const { TenantId } = req.query;
  const partner = await RegisterPartner.findOne({ where: { TenantId } });
  let promoCode = await Code.findAll({
    where: {
      PartnerApply: {
        [Op.or]: [
          { [Op.substring]: partner?.dataValues?.id },
          { [Op.is]: null },
        ],
      },
      CusApply: {
        [Op.or]: [{ [Op.substring]: req.user.id }, { [Op.is]: null }],
      },
      // PartnerConfirm: true,
      DateTimeApply: { [Op.lte]: moment().add(7, "h").toISOString() },
      DateTimeExpire: { [Op.gte]: moment().add(7, "h").toISOString() },
    },
    order: [["createdAt", "DESC"]],
  });
  promoCode = promoCode.filter(
    (code) => code.dataValues.NoOfCode > code.dataValues.NoOfJoined
  );
  res.status(200).json({
    success: true,
    data: promoCode,
  });
});

exports.customerJoinedByPromo = catchAsync(async (req, res) => {
  const { promoCodeId } = req.query;
  let promoCodes = await PromoteCode_UserSave.findAll({
    where: {
      PromoteCodeId: +promoCodeId,
      Used: { [Op.not]: null },
    },
    include: [{ model: BookingUser }],
    order: [["createdAt", "DESC"]],
  });
  // promoCode = promoCode.filter(
  //   (code) => code.dataValues.NoOfCode > code.dataValues.NoOfJoined
  // );
  res.status(200).json({
    success: true,
    data: promoCodes.map((item) => ({
      ...item.dataValues.BookingUser.dataValues,
      Used: item.dataValues.Used,
      value: item.dataValues.BookingUser.dataValues.id,
    })),
  });
});

exports.partnerJoinedByPromo = catchAsync(async (req, res) => {
  const { promoCodeId } = req.query;
  let promoCodes = await PromoteCode_UserSave.findAll({
    where: {
      PromoteCodeId: +promoCodeId,
      Used: { [Op.not]: null },
    },
    include: [{ model: BookingUser }],
    order: [["createdAt", "DESC"]],
  });
  // promoCode = promoCode.filter(
  //   (code) => code.dataValues.NoOfCode > code.dataValues.NoOfJoined
  // );
  res.status(200).json({
    success: true,
    data: promoCodes.map((item) => ({
      ...item.dataValues.BookingUser.dataValues,
      Used: item.dataValues.Used,
      value: item.dataValues.BookingUser.dataValues.id,
    })),
  });
});

// exports.getSaleCodeByTenantIdExceptUserSave = catchAsync(async (req, res) => {
//   const { TenantId } = req.query;
//   const BookingUserId = req.user.id;
//   let arr = [];
//   const SaleCodeList = await Code.findAll({
//     where: {
//       [Op.or]: [
//         { CusApply: { [Op.is]: null } },
//         { CusApply: { [Op.substring]: BookingUserId } },
//       ],
//     },
//   });

//   let codeList = await PromoteCode_UserSave.findAll({
//     where: {
//       BookingUserId,
//     },
//     attributes: ["PromoteCodeId"],
//     include: {
//       model: Code,
//     },
//   });
//   codeList = codeList.map((item) => item.dataValues.SaleCode);

//   arr = [...SaleCodeList, ...codeList];
//   res.status(200).json({
//     success: true,
//     data: arr,
//   });
// });

exports.savePromoCode = catchAsync(async (req, res) => {
  const { PromoteCodeId } = req.body;
  const BookingUserId = req.user.id;
  const checkPromo = await PromoteCode_UserSave.findOne({
    where: { PromoteCodeId, BookingUserId },
  });
  if (checkPromo) {
    throw new ApiError(404, "promoCode exit!");
  }
  const promoCode = await PromoteCode_UserSave.create({
    PromoteCodeId,
    BookingUserId,
  });
  res.status(200).json({
    success: true,
    data: promoCode,
  });
});

exports.cancelSavePromoCode = catchAsync(async (req, res) => {
  const { PromoteCodeId } = req.params;
  const BookingUserId = req.user.id;

  await PromoteCode_UserSave.destroy({
    where: {
      PromoteCodeId,
      BookingUserId,
    },
  });
  res.status(200).json({
    success: true,
  });
});

exports.getMySaleCode = catchAsync(async (req, res) => {
  const BookingUserId = req.user.id;
  let codeList = await PromoteCode_UserSave.findAll({
    where: {
      BookingUserId,
    },
    include: {
      model: Code,
      where: {
        DateTimeExpire: { [Op.gte]: moment().toISOString() },
      },
      order: [["createdAt", "DESC"]],
    },
  });
  codeList = codeList.reduce((newList, code) => {
    if (code.dataValues.Used >= code.dataValues.SaleCode.dataValues.NoOfJoin) {
      return [...newList];
    }
    return [...newList, code.dataValues.SaleCode];
  }, []);
  res.status(200).json({
    success: true,
    data: codeList,
  });
});

// exports.getMySaleCode = catchAsync(async (req, res) => {
//   const BookingUserId = req.user.id; //161;
//   const codeList = await PromoteCode_UserSave.findAll({
//     where: {
//       BookingUserId,
//     },
//     attributes: [],
//     include: {
//       model: Code,
//       where: { DateTimeExpire: { [Op.gte]: moment().add(7, "hour") } },
//     },
//   });
//   let codeSaveIds = codeList.map(
//     (item) => item.dataValues.SaleCode.dataValues.id
//   );
//   const saleCodeList = await Code.findAll({
//     where: {
//       [Op.or]: [
//         { CusApply: { [Op.or]: ["", null] } },
//         { CusApply: { [Op.substring]: BookingUserId } },
//       ],
//       id: { [Op.notIn]: codeSaveIds },
//       DateTimeExpire: { [Op.gte]: moment().add(7, "hour") },
//     },
//   });
//   res.status(200).json({
//     success: true,
//     // timeStamp: moment().add(7, "hour"),
//     data: [...codeList, ...saleCodeList],
//   });
// });

function handlerCategorySaleCode(string) {
  let list = string.split(",").map(Number);
  const mapping = {
    1: "studio",
    2: "photographer",
    3: "device",
    4: "makeup",
    5: "clothes",
    6: "model",
  };
  const output = list.map((item) => mapping[item]).join(",");
  return output;
}

exports.exportSaleCode = catchAsync(async (req, res) => {
  // let data = await Code.findAll();
  // data = data.map((item) => {
  //   return {
  //     ...item.dataValues,
  //     TypeReduce:
  //       item.dataValues.TypeReduce == 1 ? "Giảm tiền" : "Giảm tỷ lệ (%)",
  //     Category: handlerCategorySaleCode(item.dataValues.Category),
  //     PartnerConfirm: item.dataValues.PartnerConfirm ? "Có" : "Không",
  //     ReduceRate:
  //       item.dataValues.TypeReduce == 2 ? item.dataValues.ReduceValue : "",
  //     ReduceAmount:
  //       item.dataValues.TypeReduce == 1 ? item.dataValues.ReduceValue : "",
  //     createdAt: convertTime(item.dataValues.createdAt, true),
  //     DateTimeApply: convertTime(item.dataValues.DateTimeApply, true),
  //     DateTimeExpire: convertTime(item.dataValues.DateTimeExpire, true),
  //     IsDeleted: item.dataValues.IsDeleted
  //       ? "Đã huỷ"
  //       : moment(item.dataValues.DateTimeExpire) > moment()
  //       ? "Đang diễn ra"
  //       : "Hết hạn",
  //   };
  // });
  let { saleCode, dateTimeApply, dateTimeExpire, status, page, limit } =
    req.query;
  dateTimeApply = JSON.parse(dateTimeApply);
  dateTimeExpire = JSON.parse(dateTimeExpire);
  let dateCondition;
  switch (+status) {
    case 1:
      dateCondition = {
        DateTimeApply: {
          [Op.gte]: dateTimeApply?.startDate ? dateTimeApply.startDate : 1,
          [Op.lte]: moment(),
        },
        DateTimeExpire: {
          [Op.lte]: dateTimeExpire?.endDate
            ? dateTimeExpire.endDate
            : moment().add("years", 1),
          [Op.gte]: dateTimeExpire?.startDate
            ? dateTimeExpire.startDate
            : moment(),
        },
      };
      break;
    case 2:
      dateCondition = {
        DateTimeExpire: {
          [Op.lte]: moment(),
          [Op.gte]: dateTimeExpire?.startDate ? dateTimeExpire.startDate : 1,
        },
      };
      break;
    default:
      dateCondition = {};
      break;
  }
  const condition = {
    where: {
      SaleCode: {
        [Op.substring]: saleCode ? `${saleCode}` : ``,
      },
      DateTimeApply: {
        [Op.gte]: dateTimeApply?.startDate ? dateTimeApply.startDate : 1,
        [Op.lte]: dateTimeApply?.endDate
          ? dateTimeApply.endDate
          : moment().add("years", 1),
      },
      DateTimeExpire: {
        [Op.gte]: dateTimeExpire?.startDate ? dateTimeExpire.startDate : 1,
        [Op.lte]: dateTimeExpire?.endDate
          ? dateTimeExpire.endDate
          : moment().add("years", 1),
      },
      ...dateCondition,
      IsDeleted: +status === 3 ? true : { [Op.or]: [true, false] },
    },
    order: [["createdAt", "DESC"]],
  };
  let data = await Code.findAll({
    ...condition,
    include: [
      {
        model: PromoteCode_Partner,
        attributes: ["PartnerId", "PartnerConfirm"],
      },
    ],
  });
  data = data.map((item) => {
    return {
      ...item.dataValues,
      TypeReduce:
        item.dataValues.TypeReduce == 1 ? "Giảm tiền" : "Giảm tỷ lệ (%)",
      Category: handlerCategorySaleCode(item.dataValues.Category),
      PartnerConfirm: item.dataValues.PartnerConfirm ? "Có" : "Không",
      ReduceRate:
        item.dataValues.TypeReduce == 2 ? item.dataValues.ReduceValue : "",
      ReduceAmount:
        item.dataValues.TypeReduce == 1 ? item.dataValues.ReduceValue : "",
      createdAt: convertTime(item.dataValues.createdAt, true),
      DateTimeApply: convertTimeUTC(item.dataValues.DateTimeApply, true),
      DateTimeExpire: convertTimeUTC(item.dataValues.DateTimeExpire, true),
      IsDeleted: item.dataValues.IsDeleted
        ? "Đã huỷ"
        : moment(item.dataValues.DateTimeExpire) > moment()
        ? "Đang diễn ra"
        : "Hết hạn",
    };
  });
  return downloadSaleCodeExcel(data, res);
  res.send(data);
});

async function countBookings(data, item1, promoId) {
  const categories = data.dataValues.Category?.split(",") || [];

  const counts = await Promise.all(
    categories.map(async (curr) => {
      switch (Number(curr)) {
        case 1:
          return getBookingCount(StudioBooking, data, item1, promoId);
        case 2:
          return getBookingCount(PhotographerBooking, data, item1, promoId);
        // Handle other cases here if needed
        default:
          return 0;
      }
    })
  );

  return counts.reduce((acc, count) => acc + count, 0);
}

async function getBookingCount(Model, data, item1, promoId) {
  return await Model.count({
    where: {
      TenantId: item1,
      PromoCodeId: promoId,
      CreationTime: {
        [Op.and]: [
          { [Op.gte]: data.dataValues.DateTimeApply },
          { [Op.lte]: data.dataValues.DateTimeExpire },
        ],
      },
    },
  });
}
exports.exportPartnerPromo = catchAsync(async (req, res) => {
  const { promoId } = req.params;
  let data = await Code.findByPk(promoId);
  let PartnerApply = data?.dataValues?.PartnerApply?.split(",") || [];
  let PartnerJoin = data?.dataValues?.PartnerJoin?.split(",") || [];
  let data1;
  let data2;

  if (PartnerApply !== undefined) {
    data1 = await Promise.all(
      PartnerApply?.map(async (item1) => {
        let count = 0;

        count = await countBookings(data, item1, promoId);

        let partner = await RegisterPartner.findByPk(item1);
        return {
          ...data.dataValues,
          PartnerId: `PAR-${("0000000000" + item1).slice(-10)}`,
          PartnerConfirm: "Đã xác nhận",
          Used: count || 0,
          PartnerName: partner?.dataValues?.PartnerName || "",
          NoOfJoin: `${data.dataValues.NoOfJoin || 0}/${
            data.dataValues.NoOfCode || 0
          }`,
        };
      })
    );
  }
  if (PartnerJoin !== undefined) {
    data2 = await Promise.all(
      PartnerJoin?.map(async (item1) => {
        let count = 0;

        count = await countBookings(data, item1, promoId);

        let partner = await RegisterPartner.findByPk(item1);
        return {
          ...data.dataValues,
          PartnerId: `PAR-${("0000000000" + item1).slice(-10)}`,
          PartnerConfirm: "Chưa xác nhận",
          Used: count || 0,
          PartnerName: partner?.dataValues?.PartnerName || "",
          NoOfJoin: `${data.dataValues.NoOfJoin || 0}/${
            data.dataValues.NoOfCode || 0
          }`,
        };
      })
    );
  }
  // if (
  //   item.dataValues.PartnerJoin == undefined &&
  //   item.dataValues.PartnerApply == undefined
  // ) {
  //   let data3 = await Promise.all(
  //     PartnerJoin?.map(async (item1) => {
  //       let count = 0;

  //       count = await countBookings(data, item1, promoId);

  //       let partner = await RegisterPartner.findByPk(item1);
  //       return {
  //         ...data.dataValues,
  //         PartnerId: `PAR-${("0000000000" + item1).slice(-10)}`,
  //         PartnerConfirm: "Chưa xác nhận",
  //         Used: count || 0,
  //         PartnerName: partner?.dataValues?.PartnerName || "",
  //         NoOfJoin: `${data.dataValues.NoOfJoin || 0}/${
  //           data.dataValues.NoOfCode || 0
  //         }`,
  //       };
  //     })
  //   );
  // }

  // data1 = data1.flatMap((item) => Object.values(item));
  // data2 = data2.flatMap((item) => Object.values(item));
  // // data3 = data3
  // //   .filter((item) => item != null || item !== undefined)
  // //   .flatMap((item) => Object.values(item));
  data = data1.concat(data2);
  return downloadSaleCodePartnerExcel(data, res);
  res.send(data);
});
