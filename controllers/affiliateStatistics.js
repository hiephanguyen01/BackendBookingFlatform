const catchAsync = require("../middlewares/async");
const {
  AffiliateProduct,
  StudioBooking,
  StudioRoom,
  StudioPost,
  RegisterPartner,
  PhotographerPost,
  ClothesPosts,
  MakeupPost,
  DevicePost,
  ModelPost,
  PhotographerBooking,
  PhotographerServicePackage,
  MakeUpBooking,
  ModelServicePackage,
  MakeupServicePackage,
  ModelBooking,
  BookingUser,
  AffiliateUser,
  sequelize,
} = require("../models");
const moment = require("moment");
const _ = require("lodash");
const { Op, Model } = require("sequelize");
const { filterDateTime } = require("../utils/filter");
const {
  downloadListPublisherExcel,
  downloadCommissionExcel,
  downloadListOrdersExcel,
  downloadCommissionLinkExcel,
  downloadOrderAffiliateExcel,
  downloadCommissionAffiliateExcel,
} = require("./exportDataController");
const { convertTimeUTC, convertTime } = require("../utils/convert");

const handlerStatusbooking = (data, min, max) => {
  let BookingValue = 0,
    AffiliateCommission = 0,
    bookingStatus = "";
  let timeCheck = data.OrderByTime
    ? moment(data.OrderByTimeTo).utc()
    : moment(data.OrderByDateTo).utc();

  if (data?.BookingStatus == 1 && [3, 2, 4].includes(data.PaymentStatus)) {
    BookingValue = data.BookingValue;
    // AffiliateCommission = data.AffiliateCommission;
    bookingStatus = "Đã hoàn tất";
    if (timeCheck >= min && timeCheck <= max) {
      AffiliateCommission = data.AffiliateCommission;
    }
  } else if (
    data?.BookingStatus == 4 &&
    [4, 3, 2].includes(data.PaymentStatus)
  ) {
    BookingValue = data.BookingValue;
    AffiliateCommission = 0;
    bookingStatus = "Sắp tới";
  } else if (data?.BookingStatus == 2) {
    bookingStatus = "Đã Huỷ";
    BookingValue = 0;
    AffiliateCommission = 0;
  } else if (data?.BookingStatus == 4 && [1].includes(data.PaymentStatus)) {
    BookingValue = 0;
    AffiliateCommission = 0;
    bookingStatus = "chờ thanh toán";
  } else if (
    data?.BookingStatus == 3 &&
    [3, 2, 4].includes(data.PaymentStatus)
  ) {
    BookingValue = 0;
    AffiliateCommission = 0;
    bookingStatus = "Vắng mặt";
  }
  if (![1].includes(data.PaymentStatus)) {
    BookingValue = data.BookingValue;
  }
  return { AffiliateCommission, BookingValue, bookingStatus };
};

const handlerStatusBookingAffiliateOrder = (data) => {
  let bookingStatus;
  if (data?.BookingStatus == 1 && [3, 2, 4].includes(data.PaymentStatus)) {
    bookingStatus = "Đã hoàn tất";
  } else if (
    data?.BookingStatus == 4 &&
    [4, 3, 2].includes(data.PaymentStatus)
  ) {
    bookingStatus = "Sắp tới";
  } else if (data?.BookingStatus == 2) {
    bookingStatus = "Đã Huỷ";
  } else if (data?.BookingStatus == 4 && [1].includes(data.PaymentStatus)) {
    bookingStatus = "chờ thanh toán";
  } else if (
    data?.BookingStatus == 3 &&
    [3, 2, 4].includes(data.PaymentStatus)
  ) {
    bookingStatus = "Vắng mặt";
  }
  return { bookingStatus };
};
const handlerNameCategory = (category1) => {
  switch (String(category1)) {
    case "1":
      return "studio";
    case "2":
      return "photographer";
    case "3":
      return "clothes";
    case "4":
      return "makeup";
    case "5":
      return "device";
    case "6":
      return "model";
    default:
      return;
  }
};
const getUniqueAfterMerge = (arr) => {
  // merge two arrays
  // let arr = arr1.concat(arr2);
  let uniqueArr = [];

  // loop through array
  for (let i of arr) {
    const idx = uniqueArr.findIndex((item) => {
      return item.id === i.id;
    });
    if (idx == -1) {
      uniqueArr.push(i);
    } else {
      uniqueArr[idx] = {
        ...(uniqueArr[idx].dataValues || uniqueArr[idx]),
        AffiliateProducts: uniqueArr[idx].AffiliateProducts.concat(
          i.AffiliateProducts
        ),
      };
    }
  }

  return uniqueArr;
};
function check(data, min, max) {
  if (data.CreationTime >= min && data.CreationTime <= max) {
    return true;
  } else {
    return false;
  }
}
exports.statistic = catchAsync(async (req, res) => {
  let { option, date } = req.query;
  const userId = req.user.id;
  let data;
  let { filterDate, min, max } = filterDateTime(option, date);
  let data1 = await StudioBooking.findAll({
    where: {
      AffiliateUserId: userId,
      Category: 1,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
    },
    attributes: [
      "StudioRoomId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "AffiliateCommission",
      "Category",
      "BookingValue",
      "BookingValueBeforeDiscount",
      "OrderByTime",
      "OrderByTimeTo",
      "OrderByDateTo",
      "IdentifyCode",
    ],
    include: [
      {
        model: StudioRoom,
        attributes: ["id", "StudioPostId"],
        include: [
          {
            model: StudioPost,
            as: "StudioPost",
            attributes: ["id", "Name", "Image1"],
          },
        ],
      },
    ],
  });
  let data2 = await PhotographerBooking.findAll({
    where: {
      AffiliateUserId: userId,
      Category: 2,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
      },
    },
    attributes: [
      "PhotographerServicePackageId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "AffiliateCommission",
      "Category",
      "BookingValue",
      "BookingValueBeforeDiscount",
      "OrderByTime",
      "OrderByTimeTo",
      "OrderByDateTo",
      "IdentifyCode",
    ],
    include: [
      {
        model: PhotographerServicePackage,
        attributes: ["id", "PhotographerPostId"],
        include: [
          {
            model: PhotographerPost,
            as: "PhotographerPost",
            attributes: ["id", "Name", "Image1"],
          },
        ],
      },
    ],
  });
  let data4 = await MakeUpBooking.findAll({
    where: {
      AffiliateUserId: userId,
      Category: 4,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
      },
    },
    attributes: [
      "MakeupServicePackageId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "AffiliateCommission",
      "Category",
      "BookingValue",
      "BookingValueBeforeDiscount",
      "OrderByTime",
      "OrderByTimeTo",
      "OrderByDateTo",
      "IdentifyCode",
    ],
    include: [
      {
        model: MakeupServicePackage,
        attributes: ["id", "MakeupPostId"],
        include: [
          {
            model: MakeupPost,
            as: "MakeupPost",
            attributes: ["id", "Name", "Image1"],
          },
        ],
      },
    ],
  });
  let data6 = await ModelBooking.findAll({
    where: {
      AffiliateUserId: userId,
      Category: 6,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
      },
    },
    attributes: [
      "ModelId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "AffiliateCommission",
      "Category",
      "BookingValue",
      "BookingValueBeforeDiscount",
      "OrderByTime",
      "OrderByTimeTo",
      "OrderByDateTo",
      "IdentifyCode",
    ],
    include: [
      {
        model: ModelServicePackage,
        attributes: ["id", "ModelPostId"],
        include: [
          {
            model: ModelPost,
            as: "ModelPost",
            attributes: ["id", "Name", "Image1"],
          },
        ],
      },
    ],
  });
  data1 = data1
    .map((item) => {
      if (![1].includes(item.PaymentStatus)) {
        let { AffiliateCommission, BookingValue } = handlerStatusbooking(
          item.dataValues,
          min,
          max
        );
        return {
          ...item.dataValues,
          id: item.StudioRoom.StudioPost.id,
          name: item.StudioRoom.StudioPost?.Name,
          Image: item.StudioRoom.StudioPost.Image1,
          BookingValueBeforeDiscount: BookingValue,
          AffiliateCommission,
          category: item.Category,
        };
      }
    })
    .filter((item) => item != null);

  data2 = data2
    .map((item) => {
      if (![1].includes(item.PaymentStatus)) {
        let { AffiliateCommission, BookingValue } = handlerStatusbooking(
          item.dataValues,
          min,
          max
        );
        return {
          ...item.dataValues,
          id: item.PhotographerServicePackage.PhotographerPost.id,
          name: item.PhotographerServicePackage.PhotographerPost.Name,
          Image: item.PhotographerServicePackage.PhotographerPost.Image1,
          BookingValueBeforeDiscount: BookingValue,
          AffiliateCommission,
          category: item.Category,
        };
      }
    })
    .filter((item) => item != null);
  data4 = data4
    .map((item) => {
      if (item.BookingStatus == 4 && [1].includes(item.PaymentStatus)) {
        let { AffiliateCommission, BookingValue } = handlerStatusbooking(
          item.dataValues,
          min,
          max
        );
        return {
          ...item.dataValues,
          id: item.MakeupServicePackage.MakeupPost.id,
          name: item.MakeupServicePackage.MakeupPost.Name,
          Image: item.MakeupServicePackage.MakeupPost.Image1,
          BookingValueBeforeDiscount: BookingValue,
          AffiliateCommission: AffiliateCommission,
          category: item.Category,
        };
      }
    })
    .filter((item) => item != null);
  data6 = data6
    .map((item) => {
      if (![1].includes(item.PaymentStatus)) {
        let { AffiliateCommission, BookingValue } = handlerStatusbooking(
          item.dataValues,
          min,
          max
        );
        return {
          ...item.dataValues,
          id: item.ModelServicePackage.ModelPost.id,
          name: item.ModelServicePackage.ModelPost.Name,
          Image: item.ModelServicePackage.ModelPost.Image1,
          BookingValueBeforeDiscount: BookingValue,
          AffiliateCommission,
          category: item.Category,
        };
      }
    })
    .filter((item) => item != null);
  data = data1.concat(data2).concat(data6).concat(data4);
  // let totalOrder = data
  //   .map((item) => {
  //     if (item.CreationTime >= min && item.CreationTime <= max) {
  //       return { ...item };
  //     }
  //   })
  //   .filter((item) => item != null);
  //   console.log(totalOrder)

  const processedData = [];
  data.forEach((item) => {
    const key = `${item.id}-${item.category}`;
    console.log(item, key);
    if (!processedData[key]) {
      processedData[key] = {
        id: item.id,
        name: item.name,
        Image: item.Image,
        category: item.category,
        totalOrder: check(item, min, max) ? 1 : 0,
        totalComission: item.AffiliateCommission || 0,
        totalPriceOrder: check(item, min, max) ? item.BookingValue : 0,
      };
    } else {
      processedData[key].totalComission += item.AffiliateCommission;
      check(item, min, max)
        ? (processedData[key].totalPriceOrder += item.BookingValue)
        : (processedData[key].totalPriceOrder += 0);

      check(item, min, max)
        ? (processedData[key].totalOrder += 1)
        : (processedData[key].totalOrder += 0);
    }
  });
  data = Object.values(processedData);

  res.status(200).json({ result: data?.length || 0, data });
});
exports.statisticAdmin = catchAsync(async (req, res) => {
  let { option, date, pid } = req.query;
  let filterKSP = {};
  if (pid) {
    filterKSP = {
      id: {
        [Op.like]: pid,
      },
    };
  }
  // let filterDate = { [Op.not]: null };
  const { filterDate, min, max } = filterDateTime(option, date);
  let data;
  let data1 = await StudioBooking.findAll({
    where: {
      AffiliateUserId: { [Op.ne]: null },
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
    },
    attributes: [
      "AffiliateCommission",
      "BookingValue",
      "BookingStatus",
      "PaymentStatus",
      "Category",
      "OrderByTimeTo",
      "OrderByDateTo",
      "OrderByTime",
      "CreationTime",
    ],
    include: [
      {
        model: StudioRoom,
        attributes: ["id", "PriceByDate", "PriceByHour", "Name"],
        where: { ...filterKSP },
      },
    ],
  });
  let data2 = await PhotographerBooking.findAll({
    where: {
      AffiliateUserId: { [Op.ne]: null },
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
    },
    attributes: [
      "AffiliateCommission",
      "BookingValue",
      "BookingStatus",
      "PaymentStatus",
      "Category",
      "OrderByTimeTo",
      "OrderByDateTo",
      "OrderByTime",
      "CreationTime",
    ],
    include: [
      {
        model: PhotographerServicePackage,
        attributes: ["id", "PriceByDate", "PriceByHour", "Name"],
        where: { ...filterKSP },
      },
    ],
  });
  let data4 = await MakeUpBooking.findAll({
    where: {
      AffiliateUserId: { [Op.ne]: null },
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
    },
    attributes: [
      "AffiliateCommission",
      "BookingValue",
      "BookingStatus",
      "PaymentStatus",
      "Category",
      "OrderByTimeTo",
      "OrderByDateTo",
      "OrderByTime",
      "CreationTime",
    ],
    include: [
      {
        model: MakeupServicePackage,
        attributes: ["id", "PriceByDate", "PriceByHour", "Name"],
        where: { ...filterKSP },
      },
    ],
  });
  let data6 = await ModelBooking.findAll({
    where: {
      AffiliateUserId: { [Op.ne]: null },
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
    },
    attributes: [
      "AffiliateCommission",
      "BookingValue",
      "BookingStatus",
      "PaymentStatus",
      "Category",
      "OrderByTimeTo",
      "OrderByDateTo",
      "OrderByTime",
      "CreationTime",
    ],
    include: [
      {
        model: ModelServicePackage,
        attributes: ["id", "PriceByDate", "PriceByHour", "Name"],
        where: { ...filterKSP },
      },
    ],
  });
  data1 = data1
    .map((item) => {
      if (![1].includes(item.dataValues.PaymentStatus)) {
        let { AffiliateCommission, BookingValue } = handlerStatusbooking(
          item.dataValues,
          min,
          max
        );
        return {
          ...item.dataValues,
          id: item.StudioRoom?.id,
          name: item.StudioRoom?.Name,
          Image: item.StudioRoom.Image1,
          BookingValue,
          AffiliateCommission,
          category: item.Category,
          PriceByDate: item.StudioRoom.PriceByDate,
          PriceByHour: item.StudioRoom.PriceByHour,
        };
      }
    })
    .filter((item) => item != undefined);

  data2 = data2
    .map((item) => {
      if (![1].includes(item.dataValues.PaymentStatus)) {
        let { AffiliateCommission, BookingValue } = handlerStatusbooking(
          item.dataValues,
          min,
          max
        );
        return {
          ...item.dataValues,
          id: item?.PhotographerServicePackage?.id,
          name: item.PhotographerServicePackage?.Name,
          Image: item.PhotographerServicePackage.Image1,
          BookingValue,
          AffiliateCommission,
          category: item.Category,
          PriceByDate: item.PhotographerServicePackage.PriceByDate,
          PriceByHour: item.PhotographerServicePackage.PriceByHour,
        };
      }
    })
    .filter((item) => item != undefined);
  data4 = data4
    .map((item) => {
      if (![1].includes(item.dataValues.PaymentStatus)) {
        let { AffiliateCommission, BookingValue } = handlerStatusbooking(
          item.dataValues,
          min,
          max
        );
        return {
          ...item.dataValues,
          id: item.MakeupServicePackage.id,
          name: item.MakeupServicePackage?.Name,
          Image: item.MakeupServicePackage.Image1,
          BookingValue,
          AffiliateCommission,
          category: item.Category,
          PriceByDate: item.MakeupServicePackage.PriceByDate,
          PriceByHour: item.MakeupServicePackage.PriceByHour,
        };
      }
    })
    .filter((item) => item != undefined);
  data6 = data6
    .map((item) => {
      if (![1].includes(item.dataValues.PaymentStatus)) {
        let { AffiliateCommission, BookingValue } = handlerStatusbooking(
          item.dataValues,
          min,
          max
        );
        return {
          ...item.dataValues,
          id: item.ModelServicePackage.id,
          name: item.ModelServicePackage?.Name,
          Image: item.ModelServicePackage.Image1,
          BookingValue,
          AffiliateCommission,
          category: item.Category,
          PriceByDate: item.ModelServicePackage.PriceByDate,
          PriceByHour: item.ModelServicePackage.PriceByHour,
        };
      }
    })
    .filter((item) => item != undefined);
  data = data1.concat(data2, data4, data6);
  const processedData = [];
  data.forEach((item) => {
    const key = `${item.id}-${item.name}-${item.category}`;

    if (!processedData[key]) {
      processedData[key] = {
        id: item.id,
        name: item.name,
        Image: item.Image,
        totalPriceOrder: check(item, min, max) ? item.BookingValue : 0,
        totalComission: item.AffiliateCommission || 0,
        category: item.category,
        priceByDate: item.PriceByDate,
        priceByHour: item.PriceByHour,
        totalOrder: check(item, min, max) ? 1 : 0,
        commissionPercent: `${(
          (item.AffiliateCommission / item.BookingValue) *
          100
        ).toFixed(2)}%`,
      };
    } else {
      processedData[key].totalComission += item.AffiliateCommission;
      check(item, min, max)
        ? (processedData[key].totalOrder += 1)
        : (processedData[key].totalOrder += 0);
      check(item, min, max)
        ? (processedData[key].totalPriceOrder += item.BookingValue)
        : (processedData[key].totalPriceOrder += 0);
    }
  });
  const result = Object.values(processedData);
  res.status(200).json({ result: result?.length || 0, data: result });
});
exports.statisticDetail = catchAsync(async (req, res) => {
  const { option, date } = req.query;
  let info;
  let data;

  let { filterDate, min, max } = filterDateTime(option, date);

  switch (String(req.query.category)) {
    case "1":
      info = await StudioPost.findOne({
        where: { id: req.params.id },
        attributes: ["id", "Name"],
        include: [
          { model: RegisterPartner, attributes: ["PartnerName", "TenantId"] },
        ],
      });
      info.dataValues.category = handlerNameCategory(
        Number(req.query.category)
      );
      data = await StudioBooking.findAll({
        where: {
          Category: req.query.category,
          AffiliateUserId: req.user.id,
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
          // BookingStatus: 1,
          // PaymentStatus: [2,3, 4],
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
        // order:[""],
        include: [
          {
            model: StudioRoom,

            attributes: ["id", "Name", "Image1"],
            where: { StudioPostId: req.params.id },
          },
        ],
      });
      break;
    case "2":
      info = await PhotographerPost.findOne({
        where: { id: req.params.id },
        attributes: ["id", "Name"],
        include: [
          { model: RegisterPartner, attributes: ["PartnerName", "TenantId"] },
        ],
      });
      info.dataValues.category = handlerNameCategory(
        Number(req.query.category)
      );
      data = await PhotographerBooking.findAll({
        where: {
          Category: req.query.category,
          AffiliateUserId: req.user.id,
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
          // BookingStatus: 1,
          // PaymentStatus: [2,3, 4],
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
        // order:[""],
        include: [
          {
            model: PhotographerServicePackage,

            attributes: ["id", "Name", "Image1"],
            where: { PhotographerPostId: req.params.id },
          },
        ],
      });
      break;
    case "3":
    case "4":
      info = await MakeupPost.findOne({
        where: { id: req.params.id },
        attributes: ["id", "Name"],
        include: [
          { model: RegisterPartner, attributes: ["PartnerName", "TenantId"] },
        ],
      });
      info.dataValues.category = handlerNameCategory(
        Number(req.query.category)
      );
      data = await MakeUpBooking.findAll({
        where: {
          Category: req.query.category,
          AffiliateUserId: req.user.id,
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
          // BookingStatus: 1,
          // PaymentStatus: [2,3, 4],
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
        // order:[""],
        include: [
          {
            model: MakeupServicePackage,

            attributes: ["id", "Name", "Image1"],
            where: { MakeupPostId: req.params.id },
          },
        ],
      });
      break;
    case "5":
    case "6":
      info = await ModelPost.findOne({
        where: { id: req.params.id },
        attributes: ["id", "Name"],
        include: [
          { model: RegisterPartner, attributes: ["PartnerName", "TenantId"] },
        ],
      });
      info.dataValues.category = handlerNameCategory(
        Number(req.query.category)
      );
      data = await ModelBooking.findAll({
        where: {
          Category: req.query.category,
          AffiliateUserId: req.user.id,
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
          // BookingStatus: 1,
          // PaymentStatus: [2,3, 4],
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
        // order:[""],
        include: [
          {
            model: ModelServicePackage,

            attributes: ["id", "Name", "Image1"],
            where: { ModelPostId: req.params.id },
          },
        ],
      });
      break;
  }

  data = data
    .map((item) => {
      if (![1].includes(item.PaymentStatus)) {
        let { AffiliateCommission, BookingValue, bookingStatus } =
          handlerStatusbooking(item.dataValues, min, max);
        return { ...item.dataValues, AffiliateCommission, BookingValue };
      }
    })
    .filter((item) => item != null);
  res.status(200).json({ result: data.length, info, data });
});

exports.getAllOrdersAffiliate = catchAsync(async (req, res) => {
  const { afla, oid, pid, np, option, date } = req.query;
  let filterKSP = {};
  let filterKSO = {};
  // let filterDate = { [Op.not]: null };
  let { filterDate, min, max } = filterDateTime(option, date);
  if (afla) {
    filterKSO = {
      AffiliateUserId: {
        [Op.like]: afla,
      },
    };
  }
  if (oid) {
    filterKSO = {
      Id: {
        [Op.like]: oid,
      },
    };
  }
  if (pid) {
    filterKSP = {
      id: {
        [Op.like]: pid,
      },
    };
  }
  if (np) {
    filterKSP = {
      Name: {
        [Op.substring]: `%${np}`,
      },
    };
  }

  let orders = await StudioBooking.findAll({
    where: {
      AffiliateUserId: { [Op.ne]: null },
      ...filterKSO,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "BookingValueBeforeDiscount",
      "StudioRoomId",
      "AffiliateCommission",
      "category",
    ],
    include: [
      {
        model: StudioRoom,
        attributes: ["Name"],
        include: [
          {
            model: StudioPost,
            as: "StudioPost",
            attributes: ["id", "Name"],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });

  orders = orders.filter((item) => item.StudioRoom !== null);
  orders = orders.sort(
    (a, b) => Date.parse(b.CreationTime) - Date.parse(a.CreationTime)
  );

  res.status(200).json({ result: orders.length, orders });
});
exports.getAllCommissionsAffiliatePublisher = catchAsync(async (req, res) => {
  const { oid, pid, option, date } = req.query;
  const publisherId = req?.user?.id;
  let filterKSP = {};
  let filterKSO = {};
  // let filterDate = { [Op.not]: null };
  const { filterDate, min, max } = filterDateTime(option, date);
  if (oid) {
    filterKSO = {
      Id: {
        [Op.like]: oid,
      },
    };
  }
  if (pid) {
    filterKSP = {
      id: {
        [Op.like]: pid,
      },
    };
  }
  let orders = [];
  let order1 = await StudioBooking.findAll({
    where: {
      AffiliateUserId: { [Op.eq]: publisherId },
      ...filterKSO,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
     
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "BookingValue",
      "StudioRoomId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByDateTo",
    ],
    include: [
      {
        model: StudioRoom,
        attributes: ["Name"],
        include: [
          {
            model: StudioPost,
            as: "StudioPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });
  let order2 = await PhotographerBooking.findAll({
    where: {
      AffiliateUserId: { [Op.eq]: publisherId },
      ...filterKSO,
      // CreationTime: filterDate,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "BookingValue",
      "PhotographerServicePackageId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByDateTo",
    ],
    include: [
      {
        model: PhotographerServicePackage,
        attributes: ["Name"],
        include: [
          {
            model: PhotographerPost,
            as: "PhotographerPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });
  let order4 = await MakeUpBooking.findAll({
    where: {
      AffiliateUserId: { [Op.eq]: publisherId },
      ...filterKSO,
      // CreationTime: filterDate,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "BookingValue",
      "MakeupServicePackageId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByDateTo",
    ],
    include: [
      {
        model: MakeupServicePackage,
        attributes: ["Name"],
        include: [
          {
            model: MakeupPost,
            as: "MakeupPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });
  let order6 = await ModelBooking.findAll({
    where: {
      AffiliateUserId: { [Op.eq]: publisherId },
      ...filterKSO,
      // CreationTime: filterDate,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "BookingValue",
      "ModelId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByDateTo",
    ],
    include: [
      {
        model: ModelServicePackage,
        attributes: ["Name"],
        include: [
          {
            model: ModelPost,
            as: "ModelPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });

  orders = order1.concat(order2).concat(order4).concat(order6);
  orders = orders
    .filter((item) => {
      let timeCheck = moment(
        item.OrderByTime ? item.OrderByTimeTo : item.OrderByDateTo
      );
      return (
        item.StudioRoom !== null ||
        item.PhotographerServicePackage !== null ||
        item.ModelServicePackage !== null ||
        item.MakeupServicePackage !== null
      );
    })
    .map((item) => {
      console.log(item.dataValues.PaymentStatus);
      if (![1].includes(item?.dataValues?.PaymentStatus)) {
        let { AffiliateCommission, BookingValue } = handlerStatusbooking(
          item.dataValues,
          min,
          max
        );
        return {
          ...item.dataValues,
          BookingValue,
          AffiliateCommission,
        };
      }
      // return { ...item.dataValues };
    })
    .filter((item) => item != null);
  orders = orders.sort(
    (a, b) => Date.parse(b.CreationTime) - Date.parse(a.CreationTime)
  );

  res.status(200).json({ result: orders.length, orders });
});
exports.getAllComisionsAffiliate = catchAsync(async (req, res) => {
  const { oid, pid, option, date } = req.query;
  let filterKSP = {};
  let filterKSO = {};
  // let filterDate = { [Op.not]: null };
  const { filterDate, min, max } = filterDateTime(option, date);

  if (oid) {
    filterKSO = {
      Id: {
        [Op.like]: oid,
      },
    };
  }
  if (pid) {
    filterKSP = {
      id: {
        [Op.like]: pid,
      },
    };
  }
  let orders = [];
  let order1 = await StudioBooking.findAll({
    where: {
      AffiliateUserId: { [Op.ne]: null },
      ...filterKSO,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "BookingValue",
      "StudioRoomId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByDateTo",
    ],
    include: [
      {
        model: StudioRoom,
        attributes: ["Name"],
        include: [
          {
            model: StudioPost,
            as: "StudioPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });
  let order2 = await PhotographerBooking.findAll({
    where: {
      AffiliateUserId: { [Op.ne]: null },
      ...filterKSO,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "BookingValue",
      "PhotographerServicePackageId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByDateTo",
    ],
    include: [
      {
        model: PhotographerServicePackage,
        attributes: ["Name"],
        include: [
          {
            model: PhotographerPost,
            as: "PhotographerPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });
  let order4 = await MakeUpBooking.findAll({
    where: {
      AffiliateUserId: { [Op.ne]: null },
      ...filterKSO,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "BookingValue",
      "MakeupServicePackageId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByDateTo",
    ],
    include: [
      {
        model: MakeupServicePackage,
        attributes: ["Name"],
        include: [
          {
            model: MakeupPost,
            as: "MakeupPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });
  let order6 = await ModelBooking.findAll({
    where: {
      AffiliateUserId: { [Op.ne]: null },
      ...filterKSO,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "BookingValue",
      "ModelId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByDateTo",
    ],
    include: [
      {
        model: ModelServicePackage,
        attributes: ["Name"],
        include: [
          {
            model: ModelPost,
            as: "ModelPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });

  orders = order1.concat(order2).concat(order4).concat(order6);
  orders = orders.filter((item) => {
    return (
      item.StudioRoom !== null ||
      item.PhotographerServicePackage !== null ||
      item.ModelServicePackage !== null ||
      item.MakeupServicePackage !== null
    );
  });
  orders = orders
    .map((item) => {
      console.log(item.dataValues);
      // if (![1].includes(item.PaymentStatus)) {
      let { AffiliateCommission, BookingValue } = handlerStatusbooking(
        item,
        min,
        max
      );
      return {
        ...item.dataValues,
        BookingValue,
        AffiliateCommission,
        category: item.category,
      };
      // }
    })
    .filter((item) => item != null);
  orders = orders.sort(
    (a, b) => Date.parse(b.CreationTime) - Date.parse(a.CreationTime)
  );

  res.status(200).json({ result: orders.length, orders });
});

exports.getOrderAffiliate = catchAsync(async (req, res) => {
  let orders = await StudioBooking.findOne({
    where: { AffiliateUserId: { [Op.ne]: null }, Id: req.params.id },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "BookingValue",
      "StudioRoomId",
      "category",
      "AffiliateCommission",
      "OrderByTimeFrom",
      "OrderByTimeTo",
      "OrderByDateFrom",
      "OrderByDateTo",
      "BookingUserName",
      "OrderByTime",
      "CommissionPercent",
    ],
    include: [
      {
        model: StudioRoom,
        attributes: ["Name"],
        include: [
          {
            model: StudioPost,
            as: "StudioPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            include: [
              {
                model: RegisterPartner,
                attributes: ["PartnerName"],
              },
            ],
          },
        ],
      },
      {
        model: BookingUser,
        as: "user",
        attributes: ["Fullname"],
      },
      {
        model: AffiliateUser,
      },
    ],
  });
  res.status(200).json({ data: orders });
});

exports.statisticPublisher = catchAsync(async (req, res) => {
  let { option, date, pid } = req.query;
  let filterKSP = {};
  if (pid) {
    filterKSP = {
      id: {
        [Op.like]: pid,
      },
    };
  }
  let { filterDate, min, max } = filterDateTime(option, date);

  let data;
  let data1 = await AffiliateUser.findAll({
    where: filterKSP,
    attributes: ["firstName", "lastName", "id", "isPersonal"],

    include: [
      {
        model: StudioBooking,
        where: {
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
      },
    ],
  });
  let data2 = await AffiliateUser.findAll({
    where: filterKSP,
    attributes: ["firstName", "lastName", "id", "isPersonal"],
    include: [
      {
        model: PhotographerBooking,
        where: {
          ...filterKSP,
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
      },
    ],
  });
  let data4 = await AffiliateUser.findAll({
    where: filterKSP,
    attributes: ["firstName", "lastName", "id", "isPersonal"],
    include: [
      {
        model: MakeUpBooking,
        where: {
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
      },
    ],
  });
  let data6 = await AffiliateUser.findAll({
    where: filterKSP,
    attributes: ["firstName", "lastName", "id", "isPersonal"],
    include: [
      {
        model: ModelBooking,
        where: {
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
      },
    ],
  });

  data = data1.concat(data2, data4, data6);
  data = data
    .reduce((acc, obj) => {
      const existingObj = acc.find((item) => item.id === obj.dataValues.id);
      if (existingObj) {
        if (obj.dataValues.StudioBookings) {
          existingObj.bookings = existingObj.bookings
            ? existingObj.bookings.concat(obj.StudioBookings)
            : obj.StudioBookings;
        }
        if (obj.dataValues.PhotographerBookings) {
          existingObj.bookings = existingObj.bookings
            ? existingObj.bookings.concat(obj.PhotographerBookings)
            : obj.PhotographerBookings;
        }
        if (obj.dataValues.ModelBookings) {
          existingObj.bookings = existingObj.bookings
            ? existingObj.bookings.concat(obj.ModelBookings)
            : obj.ModelBookings;
        }
        if (obj.dataValues.MakeupBookings) {
          existingObj.bookings = existingObj.bookings
            ? existingObj.bookings.concat(obj.MakeupBookings)
            : obj.MakeupBookings;
        }
      } else {
        obj.dataValues.bookings =
          obj.dataValues.StudioBookings ||
          obj.dataValues.PhotographerBookings ||
          obj.dataValues.MakeupBookings ||
          obj.dataValues.ModelBookings ||
          [];
        delete obj.dataValues.StudioBookings;
        delete obj.dataValues.PhotographerBookings;
        delete obj.dataValues.MakeupBookings;
        delete obj.dataValues.ModelBookings;
        acc.push(obj.dataValues);
      }

      return acc;
    }, [])
    .map((obj) => {
      const bookings = obj.bookings
        .filter((booking) => {
          // let timeCheck = booking.OrderByTime
          //   ? booking.OrderByTimeTo
          //   : booking.OrderByDateTo;

          // console.log(
          //   moment(booking.CreationTime).utc(),
          //   min,
          //   max,
          //   booking.PaymentStatus,
          //   booking.PaymentStatus !== 1 &&
          //     moment(booking.CreationTime).utc() >= min &&
          //     moment(booking.CreationTime).utc() <= max
          // );
          return booking.PaymentStatus !== 1;
        })
        .map((item) => {
          let { AffiliateCommission, BookingValue } = handlerStatusbooking(
            item,
            min,
            max
          );
          return {
            ...item,
            BookingValue,
            AffiliateCommission,
          };
        })
        .filter((item) => item != undefined || item != null);
      return { ...obj, bookings };
    });

  data = data.map((item) => {
    const totalAffiliateCommission = item.bookings.reduce(
      (total, booking) => total + booking.AffiliateCommission,
      0
    );
    return {
      fullName: item.lastName + " " + item.firstName,
      id: item.id,
      isPersonal: item.isPersonal,
      totalOrder: item.bookings.filter(
        (item) =>
          item.dataValues.CreationTime >= min &&
          item.dataValues.CreationTime <= max
      ).length,
      totalAffiliateCommission,
    };
  });
  data = _.reverse(_.sortBy(data, ["totalOrder"]));

  res.status(200).json({ result: data.length, data });
});

exports.exportDataAffiliate = catchAsync(async (req, res) => {
  let { createDate } = req.query;
  let list = [];
  let options = {};
  if (createDate) {
    createDate = JSON.parse(createDate);
  }
  if (createDate?.startDate !== "" || createDate?.endDate !== "") {
    options = {
      ...options,
      CreationTime: {
        [Op.gte]: moment(createDate.startDate.replace(/\s/g, "+")).startOf(
          "day"
        ),
        [Op.lte]: moment(createDate.endDate.replace(/\s/g, "+")).endOf("day"),
      },
    };
  }

  let list1, list2, list6, list3;
  switch (Number(req.query.option)) {
    case 1:
      list = await AffiliateUser.findAll({
        where: options,
        attributes: [
          "id",
          "isPersonal",
          "firstName",
          "lastName",
          "address",
          "representName",
          "email",
          "phone",
          "bankAccount",
          "bankAccountOwner",
          "bankName",
          "idNumber",
          "CreationTime",
          "isActivate",
          "companyName",
          "taxCode",
          "licenseDate",
          "companyAddress",
          "addressPermanent",
        ],
      });
      list = list.map((item) => {
        return {
          ...item.dataValues,
          isPersonal: item.isPersonal ? "Cá nhân" : "Doanh nghiệp",
          fullName: `${item.lastName} ${item.firstName}`,
          isActivate: item.isActivate ? "Hoạt động" : "Ngưng hoạt động",
          address: item.isPersonal ? item.address : item.companyAddress,
          addressPermanent: item.addressPermanent,
        };
      });
      return downloadListPublisherExcel(list, res);
    case 2:
      let data1 = await StudioPost.findAll();
      let data2 = await PhotographerPost.findAll();
      let data4 = await MakeupPost.findAll();
      let data6 = await ModelPost.findAll();
      data1 = data1.map((item) => {
        return {
          id: `STD-${("0000000000" + item.id).slice(-10)}`,
          name: item.Name,
          Image: item.Image1,
          category: 1,
          AffiliateCommissionByHour: item.AffiliateCommissionByHour,
          AffiliateCommissionByDate: item.AffiliateCommissionByDate,
        };
      });

      data2 = data2.map((item) => {
        return {
          id: `PTG-${("0000000000" + item.id).slice(-10)}`,
          name: item.Name,
          Image: item.Image1,
          category: 2,
          AffiliateCommissionByHour: item.AffiliateCommissionByHour,
          AffiliateCommissionByDate: item.AffiliateCommissionByDate,
        };
      });
      data4 = data4.map((item) => {
        return {
          id: `MKP-${("0000000000" + item.id).slice(-10)}`,
          name: item.Name,
          Image: item.Image1,
          category: 4,
          AffiliateCommissionByHour: item.AffiliateCommissionByHour,
          AffiliateCommissionByDate: item.AffiliateCommissionByDate,
        };
      });
      data6 = data6.map((item) => {
        return {
          id: `MDL-${("0000000000" + item.id).slice(-10)}`,
          name: item.Name,
          Image: item.Image1,
          category: 6,
          AffiliateCommissionByHour: item.AffiliateCommissionByHour,
          AffiliateCommissionByDate: item.AffiliateCommissionByDate,
        };
      });
      list = data1.concat(data2).concat(data6).concat(data4);

      list = list.map((item) => {
        return {
          id: item.id,
          name: item.name,
          Image: item.Image,
          category: item.category,
          link: `https://affiliate.bookingstudio.vn/${handlerNameCategory(
            item.category
          )}/${item.id}`,
          AffiliateCommissionByHour: item.AffiliateCommissionByHour * 100 || 5,
          AffiliateCommissionByDate: item.AffiliateCommissionByDate * 100 || 5,
        };
      });
      return downloadCommissionLinkExcel(list, res);
    case 3:
      list1 = await StudioBooking.findAll({
        where: {
          AffiliateUserId: { [Op.not]: null },
          Category: 1,
          // CreationTime: filterDate,
          ...options,
        },
        attributes: [
          "Id",
          "AffiliateUserId",
          "BookingValue",
          "BookingStatus",
          "PaymentStatus",
          "CreationTime",
          "StudioRoomId",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByDateFrom",
          "OrderByTimeTo",
          "OrderByDateTo",
          "IdentifyCode",
        ],
        include: [
          {
            model: StudioRoom,
            attributes: ["StudioPostId", "Name"],
          },
        ],
      });
      list2 = await PhotographerBooking.findAll({
        where: {
          AffiliateUserId: { [Op.not]: null },
          Category: 2,
          // CreationTime: filterDate,
          ...options,
        },
        attributes: [
          "Id",
          "AffiliateUserId",
          "BookingValue",
          "BookingStatus",
          "PaymentStatus",
          "CreationTime",
          "PhotographerServicePackageId",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByDateFrom",
          "OrderByTimeTo",
          "OrderByDateTo",
          "IdentifyCode",
        ],
        include: [
          {
            model: PhotographerServicePackage,
            attributes: ["PhotographerPostId", "Name"],
          },
        ],
      });
      list3 = await MakeUpBooking.findAll({
        where: {
          AffiliateUserId: { [Op.not]: null },
          Category: 4,
          // CreationTime: filterDate,
          ...options,
        },
        attributes: [
          "Id",
          "AffiliateUserId",
          "BookingValue",
          "BookingStatus",
          "PaymentStatus",
          "CreationTime",
          "MakeupServicePackageId",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByDateFrom",
          "OrderByTimeTo",
          "OrderByDateTo",
          "IdentifyCode",
        ],
        include: [
          {
            model: MakeupServicePackage,
            attributes: ["MakeupPostId", "Name"],
          },
        ],
      });
      list6 = await ModelBooking.findAll({
        where: {
          AffiliateUserId: { [Op.not]: null },
          Category: 6,
          // CreationTime: filterDate,
          ...options,
        },
        attributes: [
          "Id",
          "AffiliateUserId",
          "BookingValue",
          "BookingStatus",
          "PaymentStatus",
          "CreationTime",
          "ModelId",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByDateFrom",
          "OrderByTimeTo",
          "OrderByDateTo",
          "IdentifyCode",
        ],
        include: [
          {
            model: ModelServicePackage,
            attributes: ["ModelPostId", "Name"],
          },
        ],
      });
      list1 = list1
        .map((item) => {
          if (![1].includes(item.dataValues.PaymentStatus)) {
            let { bookingStatus } = handlerStatusBookingAffiliateOrder(
              item.dataValues
            );
            return {
              ...item.dataValues,
              studioPostId: `STD-${(
                "0000000000" + item.StudioRoom.StudioPostId
              ).slice(-10)}`,
              name: item.StudioRoom.Name,
              CreationTime: convertTimeUTC(item.dataValues.CreationTime),
              bookingStatus,
              dateStart: item.OrderByTime
                ? convertTimeUTC(item.dataValues.OrderByTimeFrom, true)
                : convertTimeUTC(item.dataValues.OrderByDateFrom),
              dateEnd: item.OrderByTime
                ? convertTimeUTC(item.dataValues.OrderByTimeTo, true)
                : convertTimeUTC(item.dataValues.OrderByDateTo),
            };
          }
        })
        .filter((item) => item != undefined || item != null);
      list2 = list2
        .map((item) => {
          if (![1].includes(item.dataValues.PaymentStatus)) {
            let { bookingStatus } = handlerStatusBookingAffiliateOrder(
              item.dataValues
            );
            return {
              ...item.dataValues,
              studioPostId: `PTG-${(
                "0000000000" +
                item.PhotographerServicePackage.PhotographerPostId
              ).slice(-10)}`,
              name: item.PhotographerServicePackage.Name,
              CreationTime: convertTimeUTC(item.dataValues.CreationTime),
              bookingStatus,
              dateStart: item.OrderByTime
                ? convertTimeUTC(item.dataValues.OrderByTimeFrom, true)
                : convertTimeUTC(item.dataValues.OrderByDateFrom),
              dateEnd: item.OrderByTime
                ? convertTimeUTC(item.dataValues.OrderByTimeTo, true)
                : convertTimeUTC(item.dataValues.OrderByDateTo),
            };
          }
        })
        .filter((item) => item != undefined || item != null);
      list3 = list3
        .map((item) => {
          if (![1].includes(item.dataValues.PaymentStatus)) {
            let { bookingStatus } = handlerStatusBookingAffiliateOrder(
              item.dataValues
            );
            return {
              ...item.dataValues,
              studioPostId: `MKP-${(
                "0000000000" + item.MakeupServicePackage.MakeupPostId
              ).slice(-10)}`,
              name: item.MakeupServicePackage.Name,
              CreationTime: convertTimeUTC(item.dataValues.CreationTime),
              bookingStatus,
              dateStart: item.OrderByTime
                ? convertTimeUTC(item.dataValues.OrderByTimeFrom, true)
                : convertTimeUTC(item.dataValues.OrderByDateFrom),
              dateEnd: item.OrderByTime
                ? convertTimeUTC(item.dataValues.OrderByTimeTo, true)
                : convertTimeUTC(item.dataValues.OrderByDateTo),
            };
          }
        })
        .filter((item) => item != undefined || item != null);
      list6 = list6
        .map((item) => {
          if (![1].includes(item.dataValues.PaymentStatus)) {
            let { bookingStatus } = handlerStatusBookingAffiliateOrder(
              item.dataValues
            );

            return {
              ...item.dataValues,
              studioPostId: `MKP-${(
                "0000000000" + item.ModelServicePackage.MakeupPostId
              ).slice(-10)}`,
              name: item.ModelServicePackage.Name,
              CreationTime: convertTimeUTC(item.dataValues.CreationTime),
              bookingStatus,
              dateStart: item.OrderByTime
                ? convertTimeUTC(item.dataValues.OrderByTimeFrom, true)
                : convertTimeUTC(item.dataValues.OrderByDateFrom),
              dateEnd: item.OrderByTime
                ? convertTimeUTC(item.dataValues.OrderByTimeTo, true)
                : convertTimeUTC(item.dataValues.OrderByDateTo),
            };
          }
        })
        .filter((item) => item != undefined || item != null);

      list = list1.concat(list2).concat(list3).concat(list6);
      return downloadOrderAffiliateExcel(list, res);
    case 4:
      list1 = await StudioBooking.findAll({
        where: {
          AffiliateUserId: { [Op.not]: null },
          Category: 1,
          // CreationTime: filterDate,
          ...options,
        },
        attributes: [
          "Id",
          "AffiliateUserId",
          "BookingValue",
          "BookingStatus",
          "PaymentStatus",
          "CreationTime",
          "StudioRoomId",
          "AffiliateCommission",
          "DeletedNote",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByDateFrom",
          "OrderByTimeTo",
          "OrderByDateTo",
          "CommissionPercent",
        ],
        include: [
          {
            model: StudioRoom,
            attributes: ["StudioPostId", "Name"],
            include: {
              model: StudioPost,
              as: "StudioPost",
              attributes: ["AffiliateCommissionByHour", ""],
            },
            include: {
              model: StudioPost,
              as: "StudioPost",
              attributes: [
                "AffiliateCommissionByHour",
                "AffiliateCommissionByDate",
              ],
            },
          },
        ],
      });
      list2 = await PhotographerBooking.findAll({
        where: {
          AffiliateUserId: { [Op.not]: null },
          Category: 2,
          // CreationTime: filterDate,
          ...options,
        },
        attributes: [
          "Id",
          "AffiliateUserId",
          "BookingValue",
          "BookingStatus",
          "PaymentStatus",
          "CreationTime",
          "PhotographerServicePackageId",
          "AffiliateCommission",
          "DeletedNote",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByDateFrom",
          "OrderByTimeTo",
          "OrderByDateTo",
          "CommissionPercent",
        ],
        include: [
          {
            model: PhotographerServicePackage,
            attributes: ["PhotographerPostId", "Name"],
            include: {
              model: PhotographerPost,
              as: "PhotographerPost",
              attributes: [
                "AffiliateCommissionByHour",
                "AffiliateCommissionByDate",
              ],
            },
          },
        ],
      });
      list3 = await MakeUpBooking.findAll({
        where: {
          AffiliateUserId: { [Op.not]: null },
          Category: 2,
          // CreationTime: filterDate,
          ...options,
        },
        attributes: [
          "Id",
          "AffiliateUserId",
          "BookingValue",
          "BookingStatus",
          "PaymentStatus",
          "CreationTime",
          "MakeupServicePackageId",
          "AffiliateCommission",
          "DeletedNote",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByDateFrom",
          "OrderByTimeTo",
          "OrderByDateTo",
          "CommissionPercent",
        ],
        include: [
          {
            model: MakeupServicePackage,
            attributes: ["MakeupPostId", "Name"],
            include: {
              model: MakeupPost,
              as: "MakeupPost",
              attributes: [
                "AffiliateCommissionByHour",
                "AffiliateCommissionByDate",
              ],
            },
          },
        ],
      });
      list6 = await ModelBooking.findAll({
        where: {
          AffiliateUserId: { [Op.not]: null },
          Category: 2,
          // CreationTime: filterDate,
          ...options,
        },
        attributes: [
          "Id",
          "AffiliateUserId",
          "BookingValue",
          "BookingStatus",
          "PaymentStatus",
          "CreationTime",
          "ModelId",
          "AffiliateCommission",
          "DeletedNote",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByDateFrom",
          "OrderByTimeTo",
          "OrderByDateTo",
          "CommissionPercent",
        ],
        include: [
          {
            model: ModelServicePackage,
            attributes: ["ModelPostId", "Name"],
            include: {
              model: ModelPost,
              as: "ModelPost",
              attributes: [
                "AffiliateCommissionByHour",
                "AffiliateCommissionByDate",
              ],
            },
          },
        ],
      });

      list1 = list1
        .map((item) => {
          let BookingValue = 0,
            AffiliateCommission = 0,
            bookingStatus;
          if (
            item.dataValues.BookingStatus == 1 &&
            [2, 3, 4].includes(item.dataValues.PaymentStatus)
          ) {
            BookingValue = item.BookingValue;
            AffiliateCommission = item.AffiliateCommission;
            bookingStatus = "Đã hoàn tất";
          } else if (
            item.dataValues.BookingStatus == 4 &&
            [4, 3, 2].includes(item.dataValues.PaymentStatus)
          ) {
            return;
            BookingValue = 0;
            AffiliateCommission = 0;
            bookingStatus = "Sắp tới";
          } else if (item.dataValues.BookingStatus == 2) {
            return;
            bookingStatus = "Đã Huỷ";
            BookingValue = String(item.dataValues.DeletedNote).startsWith(
              "Quá hạn thanh toán"
            )
              ? 0
              : item.BookingValue;
            AffiliateCommission = String(
              item.dataValues.DeletedNote
            ).startsWith("Quá hạn thanh toán")
              ? 0
              : item.AffiliateCommission;
          } else if (
            item.dataValues.BookingStatus == 4 &&
            item.dataValues.PaymentStatus == 1
          ) {
            return;
            BookingValue = 0;
            AffiliateCommission = 0;
            bookingStatus = "chờ thanh toán";
          } else {
            return;
          }
          return {
            ...item.dataValues,
            studioPostId: `STD-${(
              "0000000000" + item.StudioRoom.StudioPostId
            ).slice(-10)}`,
            name: item.StudioRoom.Name,
            bookingStatus,
            commissionPercent: item.CommissionPercent || 0.05,
            BookingValue,
            AffiliateCommission,
            CreationTime: convertTimeUTC(item.dataValues.CreationTime),
            dateStart: item.OrderByTime
              ? convertTimeUTC(item.dataValues.OrderByTimeFrom, true)
              : convertTimeUTC(item.dataValues.OrderByDateFrom),
            dateEnd: item.OrderByTime
              ? convertTimeUTC(item.dataValues.OrderByTimeTo, true)
              : convertTimeUTC(item.dataValues.OrderByDateTo),
          };
        })
        .filter((item) => item != null);
      list2 = list2
        .map((item) => {
          let BookingValue = 0,
            AffiliateCommission = 0,
            bookingStatus;
          if (
            item.dataValues.BookingStatus == 1 &&
            [3, 2, 4].includes(item.dataValues.PaymentStatus)
          ) {
            BookingValue = item.BookingValue;
            AffiliateCommission = item.AffiliateCommission;
            bookingStatus = "Đã hoàn tất";
          } else if (
            item.dataValues.BookingStatus == 4 &&
            [4, 3, 2].includes(item.dataValues.PaymentStatus)
          ) {
            return;
            BookingValue = 0;
            AffiliateCommission = 0;
            bookingStatus = "Sắp tới";
          } else if (item.dataValues.BookingStatus == 2) {
            return;
            bookingStatus = "Đã Huỷ";
            BookingValue = String(item.dataValues.DeletedNote).startsWith(
              "Quá hạn thanh toán"
            )
              ? 0
              : item.BookingValue;
            AffiliateCommission = String(
              item.dataValues.DeletedNote
            ).startsWith("Quá hạn thanh toán")
              ? 0
              : item.AffiliateCommission;
          } else if (
            item.dataValues.BookingStatus == 4 &&
            [3, 2, 4].includes(item.dataValues.PaymentStatus)
          ) {
            return;
            BookingValue = 0;
            AffiliateCommission = 0;
            bookingStatus = "chờ thanh toán";
          } else {
            return;
          }
          return {
            ...item.dataValues,
            studioPostId: `PTG-${(
              "0000000000" + item.PhotographerServicePackage.PhotographerPostId
            ).slice(-10)}`,
            name: item.PhotographerServicePackage.Name,
            bookingStatus,
            commissionPercent: item.CommissionPercent || 0.05,
            BookingValue,
            AffiliateCommission,
            CreationTime: convertTimeUTC(item.dataValues.CreationTime),
            dateStart: item.OrderByTime
              ? convertTimeUTC(item.dataValues.OrderByTimeFrom, true)
              : convertTimeUTC(item.dataValues.OrderByDateFrom),
            dateEnd: item.OrderByTime
              ? convertTimeUTC(item.dataValues.OrderByTimeTo, true)
              : convertTimeUTC(item.dataValues.OrderByDateTo),
          };
        })
        .filter((item) => item != null);
      list3 = list3
        .map((item) => {
          let BookingValue = 0,
            AffiliateCommission = 0,
            bookingStatus;
          if (
            item.dataValues.BookingStatus == 1 &&
            [3, 2, 4].includes(item.dataValues.PaymentStatus)
          ) {
            BookingValue = item.BookingValue;
            AffiliateCommission = item.AffiliateCommission;
            bookingStatus = "Đã hoàn tất";
          } else if (
            item.dataValues.BookingStatus == 4 &&
            [4, 3, 2].includes(item.dataValues.PaymentStatus)
          ) {
            return;
            BookingValue = 0;
            AffiliateCommission = 0;
            bookingStatus = "Sắp tới";
          } else if (item.dataValues.BookingStatus == 2) {
            return;
            bookingStatus = "Đã Huỷ";
            BookingValue = String(item.dataValues.DeletedNote).startsWith(
              "Quá hạn thanh toán"
            )
              ? 0
              : item.BookingValue;
            AffiliateCommission = String(
              item.dataValues.DeletedNote
            ).startsWith("Quá hạn thanh toán")
              ? 0
              : item.AffiliateCommission;
          } else if (
            item.dataValues.BookingStatus == 4 &&
            [3, 2, 4].includes(item.dataValues.PaymentStatus)
          ) {
            return;
            BookingValue = 0;
            AffiliateCommission = 0;
            bookingStatus = "chờ thanh toán";
          } else {
            return;
          }
          return {
            ...item.dataValues,
            studioPostId: `MKP-${(
              "0000000000" + item.MakeupServicePackage.MakeupPostId
            ).slice(-10)}`,
            name: item.MakeupServicePackage.Name,
            bookingStatus,
            commissionPercent: item.CommissionPercent || 0.05,
            BookingValue,
            AffiliateCommission,
            CreationTime: convertTimeUTC(item.dataValues.CreationTime),
            dateStart: item.OrderByTime
              ? convertTimeUTC(item.dataValues.OrderByTimeFrom, true)
              : convertTimeUTC(item.dataValues.OrderByDateFrom),
            dateEnd: item.OrderByTime
              ? convertTimeUTC(item.dataValues.OrderByTimeTo, true)
              : convertTimeUTC(item.dataValues.OrderByDateTo),
          };
        })
        .filter((item) => item != null);
      list6 = list6
        .map((item) => {
          let BookingValue = 0,
            AffiliateCommission = 0,
            bookingStatus;
          if (
            item.dataValues.BookingStatus == 1 &&
            [3, 2, 4].includes(item.dataValues.PaymentStatus)
          ) {
            BookingValue = item.BookingValue;
            AffiliateCommission = item.AffiliateCommission;
            bookingStatus = "Đã hoàn tất";
          } else if (
            item.dataValues.BookingStatus == 4 &&
            [4, 3, 2].includes(item.dataValues.PaymentStatus)
          ) {
            return;
            BookingValue = 0;
            AffiliateCommission = 0;
            bookingStatus = "Sắp tới";
          } else if (item.dataValues.BookingStatus == 2) {
            return;
            bookingStatus = "Đã Huỷ";
            BookingValue = String(item.dataValues.DeletedNote).startsWith(
              "Quá hạn thanh toán"
            )
              ? 0
              : item.BookingValue;
            AffiliateCommission = String(
              item.dataValues.DeletedNote
            ).startsWith("Quá hạn thanh toán")
              ? 0
              : item.AffiliateCommission;
          } else if (
            item.dataValues.BookingStatus == 4 &&
            [3, 2, 4].includes(item.dataValues.PaymentStatus)
          ) {
            return;
            BookingValue = 0;
            AffiliateCommission = 0;
            bookingStatus = "chờ thanh toán";
          } else {
            return;
          }
          return {
            ...item.dataValues,
            studioPostId: `MDL-${(
              "0000000000" + item.ModelServicePackage.ModelPostId
            ).slice(-10)}`,
            name: item.ModelServicePackage.Name,
            bookingStatus,
            commissionPercent: item.CommissionPercent || 0.05,
            BookingValue,
            AffiliateCommission,
            CreationTime: convertTimeUTC(item.dataValues.CreationTime),
            dateStart: item.OrderByTime
              ? convertTimeUTC(item.dataValues.OrderByTimeFrom, true)
              : convertTimeUTC(item.dataValues.OrderByDateFrom),
            dateEnd: item.OrderByTime
              ? convertTimeUTC(item.dataValues.OrderByTimeTo, true)
              : convertTimeUTC(item.dataValues.OrderByDateTo),
          };
        })
        .filter((item) => item != null);
      list = list1.concat(list2, list3, list6);
      return downloadCommissionAffiliateExcel(list, res);
  }
  res.status(200).json({ result: list.length, data: list });
});

exports.statisticProductDetail = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { category, option, date } = req.query;
  let data = [];
  let info = {};
  let { filterDate, min, max } = filterDateTime(option, date);
  switch (Number(category)) {
    case 1:
      info = await StudioRoom.findOne({
        where: { id: req.params.id },
        attributes: ["id", "Name", "TenantId"],
        include: [
          {
            model: RegisterPartner,
            foreignKey: "TenantId",
            attributes: ["PartnerName", "TenantId"],
          },
        ],
      });

      data = await StudioBooking.findAll({
        where: {
          StudioRoomId: id,
          AffiliateUserId: { [Op.ne]: null },
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
        include: [{ model: StudioRoom, attributes: ["Image1", "Name"] }],
      });

      break;
    case 2:
      info = await PhotographerPost.findOne({
        where: { id: req.params.id },

        attributes: ["id", "Name"],
        include: [
          { model: RegisterPartner, attributes: ["PartnerName", "TenantId"] },
        ],
      });

      data = await PhotographerBooking.findAll({
        where: {
          PhotographerServicePackageId: id,
          AffiliateUserId: { [Op.ne]: null },
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
        include: [
          { model: PhotographerServicePackage, attributes: ["Image1", "Name"] },
        ],
      });
      break;
    case 4:
      info = await MakeupPost.findOne({
        where: { id: req.params.id },
        attributes: ["id", "Name"],
        include: [
          { model: RegisterPartner, attributes: ["PartnerName", "TenantId"] },
        ],
      });

      data = await MakeUpBooking.findAll({
        where: {
          MakeupServicePackageId: id,
          AffiliateUserId: { [Op.ne]: null },
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
        include: [
          { model: MakeupServicePackage, attributes: ["Image1", "Name"] },
        ],
      });
      break;
    case 6:
      info = await ModelPost.findOne({
        where: { id: req.params.id },
        attributes: ["id", "Name"],
        include: [
          { model: RegisterPartner, attributes: ["PartnerName", "TenantId"] },
        ],
      });

      data = await ModelBooking.findAll({
        where: {
          ModelId: id,
          AffiliateUserId: { [Op.ne]: null },
          [Op.or]: {
            OrderByTimeTo: {
              [Op.between]: [min, max],
            },
            OrderByDateTo: {
              [Op.between]: [min, max],
            },
            CreationTime: {
              [Op.between]: [min, max],
            },
          },
        },
        attributes: [
          "id",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "BookingValueBeforeDiscount",
          "CreationTime",
          "BookingStatus",
          "PaymentStatus",
          "AffiliateCommission",
          "BookingValue",
        ],
        include: [
          { model: ModelServicePackage, attributes: ["Image1", "Name"] },
        ],
      });

      break;

    default:
      break;
  }
  info.dataValues.category = handlerNameCategory(Number(category));
  data = data
    .map((item) => {
      if (![1].includes(item.PaymentStatus)) {
        let { AffiliateCommission, BookingValue, bookingStatus } =
          handlerStatusbooking(item?.dataValues, min, max);

        return {
          ...item?.dataValues,
          AffiliateCommission,
          BookingValue,
          bookingStatus,
        };
      }
    })
    .filter((item) => item != undefined);
  res.status(200).json({ info, data });
});

exports.CommissionAffiliateExport = catchAsync(async (req, res) => {
  const { oid, pid, option, date, publisherId } = req.query;

  let filterKSP = {};
  let filterKSO = {};
  // let filterDate = { [Op.not]: null };
  const { filterDate, min, max } = filterDateTime(option, date);

  if (oid) {
    filterKSO = {
      Id: {
        [Op.like]: oid,
      },
    };
  }
  if (pid) {
    filterKSP = {
      id: {
        [Op.like]: pid,
      },
    };
  }
  let orders = [];
  let order1 = await StudioBooking.findAll({
    where: {
      AffiliateUserId: publisherId
        ? { [Op.eq]: publisherId }
        : { [Op.ne]: null },
      ...filterKSO,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "IdentifyCode",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "BookingValue",
      "StudioRoomId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByTimeFrom",
      "OrderByDateTo",
      "OrderByDateFrom",
    ],
    include: [
      {
        model: StudioRoom,
        attributes: ["Name"],
        include: [
          {
            model: StudioPost,
            as: "StudioPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });
  let order2 = await PhotographerBooking.findAll({
    where: {
      AffiliateUserId: publisherId
        ? { [Op.eq]: publisherId }
        : { [Op.ne]: null },
      ...filterKSO,
      ...filterKSO,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "IdentifyCode",
      "PaymentStatus",
      "BookingValue",
      "PhotographerServicePackageId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByTimeFrom",
      "OrderByDateTo",
      "OrderByDateFrom",
    ],
    include: [
      {
        model: PhotographerServicePackage,
        attributes: ["Name"],
        include: [
          {
            model: PhotographerPost,
            as: "PhotographerPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });
  let order4 = await MakeUpBooking.findAll({
    where: {
      AffiliateUserId: publisherId
        ? { [Op.eq]: publisherId }
        : { [Op.ne]: null },
      ...filterKSO,
      ...filterKSO,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "IdentifyCode",
      "BookingStatus",
      "PaymentStatus",
      "BookingValue",
      "MakeupServicePackageId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByTimeFrom",
      "OrderByDateTo",
      "OrderByDateFrom",
    ],
    include: [
      {
        model: MakeupServicePackage,
        attributes: ["Name"],
        include: [
          {
            model: MakeupPost,
            as: "MakeupPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });
  let order6 = await ModelBooking.findAll({
    where: {
      AffiliateUserId: publisherId
        ? { [Op.eq]: publisherId }
        : { [Op.ne]: null },
      ...filterKSO,
      ...filterKSO,
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [min, max],
        },
        OrderByDateTo: {
          [Op.between]: [min, max],
        },
        CreationTime: {
          [Op.between]: [min, max],
        },
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
    attributes: [
      "Id",
      "AffiliateUserId",
      "CreationTime",
      "BookingStatus",
      "PaymentStatus",
      "IdentifyCode",
      "BookingValue",
      "ModelId",
      "AffiliateCommission",
      "category",
      "OrderByTime",
      "CommissionPercent",
      "OrderByTimeTo",
      "OrderByTimeFrom",
      "OrderByDateTo",
      "OrderByDateFrom",
    ],
    include: [
      {
        model: ModelServicePackage,
        attributes: ["Name"],
        include: [
          {
            model: ModelPost,
            as: "ModelPost",
            attributes: [
              "id",
              "Name",
              "AffiliateCommissionByHour",
              "AffiliateCommissionByDate",
            ],
            where: { ...filterKSP },
          },
        ],
      },
    ],
  });
  order1 = order1.map((item) => {
    return {
      ...item.dataValues,
      studioPostId: `STD-${(
        "0000000000" + item.dataValues.StudioRoom.StudioPost.id
      ).slice(-10)}`,
      name: item.dataValues.StudioRoom.StudioPost.Name,
    };
  });
  order2 = order2.map((item) => {
    return {
      ...item.dataValues,
      studioPostId: `PTG-${(
        "0000000000" +
        item.dataValues.PhotographerServicePackage.PhotographerPost.id
      ).slice(-10)}`,
      name: item.dataValues.PhotographerServicePackage.PhotographerPost.Name,
    };
  });
  order4 = order4.map((item) => {
    return {
      ...item.dataValues,
      studioPostId: `MKP-${(
        "0000000000" + item.dataValues.MakeupServicePackage.MakeupPost.id
      ).slice(-10)}`,
      name: item.dataValues.MakeupServicePackage.MakeupPost.Name,
    };
  });
  order6 = order6.map((item) => {
    return {
      ...item.dataValues,
      studioPostId: `MDL-${(
        "0000000000" + item.dataValues.ModelServicePackage.ModelPost.id
      ).slice(-10)}`,
      name: item.dataValues.ModelServicePackage.ModelPost.Name,
    };
  });
  orders = order1.concat(order2).concat(order4).concat(order6);
  orders = orders
    .filter((item) => {
      // let timeCheck = item.OrderByTime
      //   ? item?.OrderByTimeTo
      //   : item?.OrderByDateTo;
      return (
        item.StudioRoom !== null ||
        item.PhotographerServicePackage !== null ||
        item.ModelServicePackage !== null ||
        item.MakeupServicePackage !== null
      );
    })
    .map((item) => {
      let dateStart = item?.OrderByTime
        ? convertTimeUTC(item?.OrderByTimeFrom, true)
        : item?.OrderByDateFrom;
      let dateEnd = item?.OrderByTime
        ? convertTimeUTC(item?.OrderByTimeTo, true)
        : item?.OrderByDateTo;
      let { AffiliateCommission, BookingValue } = handlerStatusbooking(
        item,
        min,
        max
      );
      return {
        ...item,
        BookingValue,
        AffiliateCommission,
        dateStart,
        dateEnd,
        bookingStatus: "Đã hoàn tất",
        CreationTime: convertTime(item.CreationTime, true),
        CommissionPercent: item.CommissionPercent || 0.05,
      };
      // return { ...item.dataValues };
    })
    .filter((item) => item != null);

  orders = orders.sort(
    (a, b) => Date.parse(b.CreationTime) - Date.parse(a.CreationTime)
  );
  return downloadCommissionAffiliateExcel(orders, res);

  res.status(200).json({ orders });
});
