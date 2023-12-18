const moment = require("moment");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const _ = require("lodash");

const catchAsync = require("../middlewares/async");
const {
  AffiliateStatisticDaily,
  AffiliateStatisticMonthly,
  StatisticData,
  StatisticDataWeek,
  StatisticDataDaily,
  RegisterPartner,
  BookingUser,
  MakeupPost,
  ModelPost,
  StudioPost,
  PhotographerPost,
  ClothesPost,
  DevicePost,
  StudioBooking,
  PhotographerBooking,
  ModelBooking,
  MakeUpBooking,
  Sequelize,
  AffiliateAccessCount,
} = require("../models");
const ApiError = require("../utils/ApiError");
exports.getLasttest = catchAsync(async (req, res) => {
  const Month = new Date().getMonth() + 1;
  const Year = new Date().getFullYear();
  const data = await StatisticData.findOne({
    where: {
      Month,
      Year,
    },
  });
  res.status(200).json({
    success: true,
    data: {
      ...data.dataValues,
      PartnerByCategory: JSON.parse(data.dataValues.PartnerByCategory),
      PostByMonth: JSON.parse(data.dataValues.PostByMonth),
      PostByCategory: JSON.parse(data.dataValues.PostByCategory),
      TotalBookingValue: JSON.parse(data.dataValues.TotalBookingValue),
      NumberOfBookingAll: JSON.parse(data.dataValues.NumberOfBookingAll),
    },
  });
});
exports.getLastWeek = catchAsync(async (req, res) => {
  const data = await StatisticDataWeek.findOne({
    where: {
      To: {
        [Op.gte]: new Date(),
      },
    },
  });
  res.status(200).json({
    success: true,
    data: {
      ...data.dataValues,
      PartnerByCategory: JSON.parse(data.dataValues.PartnerByCategory),
      PostByWeek: JSON.parse(data.dataValues.PostByWeek),
      PostByCategory: JSON.parse(data.dataValues.PostByCategory),
    },
  });
});
exports.getWeekDataByDate = catchAsync(async (req, res) => {
  const { Month, Year } = req.query;
  const data = await StatisticDataWeek.findAll({
    where: {
      [Op.and]: [
        sequelize.where(sequelize.fn("MONTH", sequelize.col("From")), Month),
        sequelize.where(sequelize.fn("YEAR", sequelize.col("From")), Year),
      ],
    },
  });
  res.status(200).json({
    success: true,
    data: data.map((val) => ({
      ...val.dataValues,
      PartnerByCategory: data.length
        ? JSON.parse(val.dataValues.PartnerByCategory)
        : undefined,
      PostByWeek: data.length
        ? JSON.parse(val.dataValues.PostByWeek)
        : undefined,
      PostByCategory: data.length
        ? JSON.parse(val.dataValues.PostByCategory)
        : undefined,
    })),
  });
});
exports.getByDate = catchAsync(async (req, res) => {
  const { Month, Year } = req.query;
  const data = await StatisticData.findOne({
    where: {
      Month,
      Year,
    },
  });
  res.status(200).json({
    success: true,
    data: {
      ...data.dataValues,
      PartnerByCategory: JSON.parse(data.dataValues.PartnerByCategory),
      PostByMonth: JSON.parse(data.dataValues.PostByMonth),
      PostByCategory: JSON.parse(data.dataValues.PostByCategory),
      TotalBookingValue: JSON.parse(data.dataValues.TotalBookingValue),
      NumberOfBookingAll: JSON.parse(data.dataValues.NumberOfBookingAll),
    },
  });
});
exports.getLastManyDay = catchAsync(async (req, res) => {
  const { limit } = req.query;
  const data = await StatisticDataDaily.findAll({
    limit: +limit,
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({
    success: true,
    data: data.map((val) => ({
      ...val.dataValues,
      PartnerByCategory: JSON.parse(val.dataValues.PartnerByCategory),
      PostByDay: JSON.parse(val.dataValues.PostByDay),
      PostByCategory: JSON.parse(val.dataValues.PostByCategory),
    })),
  });
});
exports.getLastMonth = catchAsync(async (req, res) => {
  const Year = new Date().getFullYear();
  const LastMonth = new Date().getMonth();
  const data = await StatisticDataDaily.findAll({
    order: [["createdAt", "DESC"]],
    where: {
      [Op.and]: [
        sequelize.where(
          sequelize.fn("MONTH", sequelize.col("Date")),
          LastMonth
        ),
        sequelize.where(sequelize.fn("YEAR", sequelize.col("Date")), Year),
      ],
    },
  });
  res.status(200).json({
    success: true,
    data: data.map((val) => ({
      ...val.dataValues,
      PartnerByCategory: JSON.parse(val.dataValues.PartnerByCategory),
      PostByDay: JSON.parse(val.dataValues.PostByDay),
      PostByCategory: JSON.parse(val.dataValues.PostByCategory),
    })),
  });
});

exports.getBySpecifyDate = catchAsync(async (req, res) => {
  let { date } = req.query;
  if (!date) throw new ApiError(400, "Fail");
  else date = JSON.parse(date);
  const startDay = date?.startDate
    ? new Date(date.startDate).setUTCHours(0, 0, 0, 0)
    : 1;
  const endDay = date?.startDate
    ? new Date(date.endDate).setUTCHours(23, 59, 59, 999)
    : new Date();
  const data = await StatisticDataDaily.findAll({
    where: {
      Date: {
        [Op.between]: [startDay, endDay],
      },
    },
  });
  res.status(200).json({
    success: true,
    data: data.map((val) => ({
      ...val.dataValues,
      PartnerByCategory: JSON.parse(val.dataValues.PartnerByCategory),
      PostByDay: JSON.parse(val.dataValues.PostByDay),
      PostByCategory: JSON.parse(val.dataValues.PostByCategory),
    })),
  });
});

//new

const getLastDayCondition = (number) => {
  return {
    where: {
      CreationTime: {
        [Op.between]: [moment().utc().subtract(number, "d"), moment().utc()],
      },
    },
  };
};
const getMonthCondition = (option) => {
  let Month, Year;
  if (option === "this") {
    Year = moment().year();
    Month = moment().month() + 1;
  } else {
    Year = moment().year();
    Month = moment().month();
    if (Month === 12) {
      Year = Year - 1;
    }
  }
  return {
    where: {
      [Op.and]: [
        sequelize.where(
          sequelize.fn("MONTH", sequelize.col("CreationTime")),
          Month
        ),
        sequelize.where(
          sequelize.fn("YEAR", sequelize.col("CreationTime")),
          Year
        ),
      ],
    },
  };
};
const getSpecifyDate = (date) => {
  return {
    where: {
      CreationTime: {
        [Op.between]: [
          moment(date.startDate).utc().startOf("day"),
          moment(date.endDate).utc().endOf("day"),
        ],
      },
    },
  };
};
const getThisYear = () => {
  const Year = moment().year();

  return {
    where: {
      [Op.and]: [
        sequelize.where(
          sequelize.fn("YEAR", sequelize.col("CreationTime")),
          Year
        ),
      ],
    },
  };
};
const get3MonthCondition = (option) => {
  let Month, Year, Quater;
  if (option === "this") {
    Quater = moment().quarter();
    Year = moment().year();
  } else {
    Quater = moment().quarter() - 1;
    Year = moment().year();
    if (Quater === 4) {
      Year = Year - 1;
    }
  }
  Month = [Quater * 3 - 2, Quater * 3 - 1, Quater * 3];
  return {
    where: {
      [Op.or]: [
        [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("CreationTime")),
            Month[2]
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("CreationTime")),
            Year
          ),
        ],
        [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("CreationTime")),
            Month[1]
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("CreationTime")),
            Year
          ),
        ],
        [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("CreationTime")),
            Month[1]
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("CreationTime")),
            Year
          ),
        ],
      ],
    },
  };
};

exports.getCount = catchAsync(async (req, res) => {
  let { option, date } = req.query;
  if (date !== "") {
    date = JSON.parse(date);
  }
  const condition = {
    1: getLastDayCondition(7),
    2: getLastDayCondition(30),
    3: getMonthCondition("this"),
    4: getMonthCondition("last"),
    5: get3MonthCondition("this"),
    6: get3MonthCondition("last"),
    7: getThisYear(),
    8: getSpecifyDate(date),
  };

  const partners = await RegisterPartner.count();
  const partnersLast = await RegisterPartner.count(condition[option]);
  const customers = await BookingUser.count();
  const customersLast = await BookingUser.count(condition[option]);

  const percentPartner = (partnersLast / (partners - partnersLast)) * 100;
  const percentCustomer = (customersLast / (customers - customersLast)) * 100;

  const makeupPosts = await MakeupPost.count(condition[option]);
  const modelPosts = await ModelPost.count(condition[option]);
  const studioPosts = await StudioPost.count(condition[option]);
  const photographerPosts = await PhotographerPost.count(condition[option]);
  const clothesPosts = await ClothesPost.count(condition[option]);
  const devicePosts = await DevicePost.count(condition[option]);

  const totalmakeupPosts = await MakeupPost.count();
  const totalmodelPosts = await ModelPost.count();
  const totalstudioPosts = await StudioPost.count();
  const totalphotographerPosts = await PhotographerPost.count();
  const totalclothesPosts = await ClothesPost.count();
  const totaldevicePosts = await DevicePost.count();

  const totalPost =
    totalmakeupPosts +
    totalmodelPosts +
    totalstudioPosts +
    totalphotographerPosts +
    totalclothesPosts +
    totaldevicePosts;

  res.status(200).json({
    success: true,
    data: {
      partners,
      customers,
      percentPartner,
      percentCustomer,
      makeupPosts,
      modelPosts,
      studioPosts,
      photographerPosts,
      clothesPosts,
      devicePosts,
      totalPost,
    },
  });
});

const getDataByDay = async (limit) => {
  const data = await StatisticDataDaily.findAll({
    limit: +limit,
    order: [["createdAt", "DESC"]],
    attributes: {
      exclude: [
        "PartnerByCategory",
        "PostByCategory",
        "createdAt",
        "updatedAt",
      ],
    },
  });
  return data.map((val) => ({
    ...val.toJSON(),
    Partner: val.toJSON().DailyPartner,
    BookingUser: val.toJSON().BookingUserByDay,
    Date: moment(val.toJSON().Date).format("DD/MM"),
    Bookings: val.toJSON().BookingByDay,
    BookingValue: val.toJSON().ValueOfBookingByDay,
    BookingSuccess: val.toJSON().BookingSuccess,
    BookingFail: val.toJSON().BookingFail,
    Post: JSON.parse(val.toJSON().PostByDay),
  }));
};
const getDataByMonth = async (option) => {
  let Year, Month;
  if (option === "this") {
    Year = moment().year();
    Month = moment().month() + 1;
  } else {
    Year = moment().year();
    Month = moment().month();
    if (Month === 12) {
      Year = Year - 1;
    }
  }

  const data = await StatisticDataDaily.findAll({
    where: {
      [Op.and]: [
        sequelize.where(sequelize.fn("MONTH", sequelize.col("Date")), Month),
        sequelize.where(sequelize.fn("YEAR", sequelize.col("Date")), Year),
      ],
    },
    order: [["createdAt", "DESC"]],
    attributes: {
      exclude: [
        "PartnerByCategory",
        "PostByCategory",
        "createdAt",
        "updatedAt",
      ],
    },
  });
  return data.map((val) => ({
    ...val.toJSON(),
    Partner: val.toJSON().DailyPartner,
    BookingUser: val.toJSON().BookingUserByDay,
    Date: moment(val.toJSON().Date).format("DD/MM"),
    Bookings: val.toJSON().BookingByDay,
    BookingValue: val.toJSON().ValueOfBookingByDay,
    BookingSuccess: val.toJSON().BookingSuccess,
    BookingFail: val.toJSON().BookingFail,
    Post: JSON.parse(val.toJSON().PostByDay),
  }));
};
const getDataBy3Month = async (option) => {
  let Month, Year, Quater;
  if (option === "this") {
    Quater = moment().quarter();
    Year = moment().year();
  } else {
    Quater = moment().quarter() - 1;
    Year = moment().year();
    if (Quater === 0) {
      Quater = 4;
      Year = Year - 1;
    }
  }
  Month = [Quater * 3, Quater * 3 - 1, Quater * 3 - 2];
  const data = await StatisticData.findAll({
    where: {
      Month,
      Year,
    },
    order: [["Month", "DESC"]],
  });
  return data.map((val, idx) => ({
    ...val.toJSON(),
    Partner: val.toJSON().MonthPartner,
    BookingUser: val.toJSON().BookingUserByMonth,
    Date: `${val.Month}-${val.Year}`,
    Bookings: val.toJSON().BookingByMonth,
    BookingValue: val.toJSON().ValueOfBookingByMonth,
    BookingSuccess: val.toJSON().BookingSuccess,
    BookingFail: val.toJSON().BookingFail,
    Post: JSON.parse(val.toJSON().PostByMonth),
  }));
};
const getDataThisYear = async () => {
  let Year = moment().year();
  const data = await StatisticData.findAll({
    where: {
      Year,
    },
  });
  return data
    .map((val, idx) => ({
      ...val.toJSON(),
      Partner: val.toJSON().MonthPartner,
      BookingUser: val.toJSON().BookingUserByMonth,
      Date: `${val.toJSON().Month}-${Year}`,
      Bookings: val.toJSON().BookingByMonth,
      BookingValue: val.toJSON().ValueOfBookingByMonth,
      BookingSuccess: val.toJSON().BookingSuccess,
      BookingFail: val.toJSON().BookingFail,
      Post: JSON.parse(val.toJSON().PostByMonth),
    }))
    .sort((a, b) => b.Month - a.Month);
};
const getDataBySpecifyDate = async (date) => {
  const data = await StatisticDataDaily.findAll({
    where: {
      Date: {
        [Op.between]: [
          moment(date.startDate).startOf("dates"),
          moment(date.endDate).endOf("dates"),
        ],
      },
    },
    order: [["createdAt", "DESC"]],
    attributes: {
      exclude: [
        "PartnerByCategory",
        "PostByCategory",
        "createdAt",
        "updatedAt",
      ],
    },
  });
  return data.map((val) => ({
    ...val.toJSON(),
    Partner: val.toJSON().DailyPartner,
    BookingUser: val.toJSON().BookingUserByDay,
    Date: moment(val.toJSON().Date).format("DD/MM"),
    Bookings: val.toJSON().BookingByDay,
    BookingValue: val.toJSON().ValueOfBookingByDay,
    BookingSuccess: val.toJSON().BookingSuccess,
    BookingFail: val.toJSON().BookingFail,
    Post: val?.toJSON()?.PostByDay ? JSON.parse(val?.toJSON()?.PostByDay) : "",
  }));
};

exports.getDataPartnerCustomer = catchAsync(async (req, res) => {
  let { option, date } = req.query;
  if (date !== "") {
    date = JSON.parse(date);
  }
  const condition = {
    1: await getDataByDay(7),
    2: await getDataByDay(30),
    3: await getDataByMonth("this"),
    4: await getDataByMonth("last"),
    5: await getDataBy3Month("this"),
    6: await getDataBy3Month("last"),
    7: await getDataThisYear(),
    8: await getDataBySpecifyDate(date),
  };

  res.status(200).json({
    success: true,
    data: condition[option],
  });
});
const getDataAffiliateByDay = async (limit, AffiliateUserId) => {
  let data;
  if (AffiliateUserId) {
    data = await AffiliateStatisticDaily.findAll({
      where: {
        AffiliateUserId,
        createdAt: {
          [Op.between]: [moment().subtract(limit, "d"), moment()],
        },
      },
      order: [["createdAt", "ASC"]],
    });
  } else {
    data = await AffiliateStatisticDaily.findAll({
      where: {
        createdAt: {
          [Op.between]: [moment().subtract(limit, "d"), moment()],
        },
      },
      order: [["createdAt", "ASC"]],
    });
  }
  return data.map((val) => ({
    ...val.toJSON(),
    Date: moment(val?.toJSON()?.createdAt).format("DD/MM"),
  }));
};
const getDataAffiliateByMonth = async (option, AffiliateUserId) => {
  let Year, Month;
  if (option === "this") {
    Year = moment().year();
    Month = moment().month() + 1;
  } else {
    Year = moment().year();
    Month = moment().month();
    if (Month === 12) {
      Year = Year - 1;
    }
  }
  let data;

  if (AffiliateUserId) {
    data = await AffiliateStatisticDaily.findAll({
      where: {
        AffiliateUserId,
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("createdAt")),
            Month
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("createdAt")),
            Year
          ),
        ],
      },
      order: [["createdAt", "ASC"]],
    });
  } else {
    data = await AffiliateStatisticDaily.findAll({
      where: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("createdAt")),
            Month
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("createdAt")),
            Year
          ),
        ],
      },
      order: [["createdAt", "ASC"]],
    });
  }

  return data.map((val) => ({
    ...val.toJSON(),
    Date: moment(val.toJSON().createdAt).format("DD/MM"),
  }));
};
const getDataAffiliateBy3Month = async (option, AffiliateUserId) => {
  let Month, Year, Quater;
  if (option === "this") {
    Quater = moment().quarter();
    Year = moment().year();
  } else {
    Quater = moment().quarter() - 1;
    Year = moment().year();
    if (Quater === 0) {
      Quater = 4;
      Year = Year - 1;
    }
  }
  Month = [Quater * 3 - 2, Quater * 3 - 1, Quater * 3];
  let data;

  if (AffiliateUserId) {
    data = await AffiliateStatisticMonthly.findAll({
      where: {
        AffiliateUserId,
        Month,
        Year,
      },
    });
    return data.map((val, idx) => ({
      ...val.toJSON(),
      Date: `${Month[idx]}-${Year}`,
    }));
  } else {
    data = await AffiliateStatisticMonthly.findAll({
      where: {
        Month,
        Year,
      },
    });
    const combinedData = _.chain(data.map((val) => val.dataValues))
      .groupBy((d) => `${d.Month}-${d.Year}`)
      .map((groupedData, key) => {
        const [month, year] = key.split("-");
        const combined = groupedData.reduce(
          (acc, d) => {
            acc.Booking += d.Booking;
            acc.BookingValue += d.BookingValue;
            acc.Click += d.Click;
            acc.Commission += d.Commission;
            return acc;
          },
          {
            Month: +month,
            Year: +year,
            Date: `${+month}-${+year}`,
            Booking: 0,
            BookingValue: 0,
            Click: 0,
            Commission: 0,
          }
        );
        return combined;
      })
      .value();
    return combinedData;
  }
};
const getDataAffiliateThisYear = async (AffiliateUserId) => {
  let Year = moment().year();
  let data;
  if (AffiliateUserId) {
    data = await AffiliateStatisticMonthly.findAll({
      where: {
        AffiliateUserId,
        Year,
      },
    });
  } else {
    data = await AffiliateStatisticMonthly.findAll({
      where: {
        Year,
      },
    });
  }
  return data
    .map((val) => ({ ...val.toJSON(), Date: `${val.toJSON().Month}-${Year}` }))
    .sort((a, b) => a.Month - b.Month);
};
const getDataAffiliateBySpecifyDate = async (date, AffiliateUserId) => {
  let data;
  if (AffiliateUserId) {
    data = await AffiliateStatisticDaily.findAll({
      where: {
        AffiliateUserId,
        createdAt: {
          [Op.between]: [
            moment(date.startDate).startOf("days"),
            moment(date.endDate).endOf("days"),
          ],
        },
      },
      order: [["createdAt", "ASC"]],
    });
  } else {
    data = await AffiliateStatisticDaily.findAll({
      where: {
        createdAt: {
          [Op.between]: [
            moment(date.startDate).startOf("days"),
            moment(date.endDate).endOf("days"),
          ],
        },
      },
      order: [["createdAt", "ASC"]],
    });
  }
  return data.map((val) => ({
    ...val.toJSON(),
    Date: moment(val.toJSON().createdAt).format("DD/MM"),
  }));
};

exports.getAffiliateData = catchAsync(async (req, res) => {
  let { option, date } = req.query;
  const userId = req?.user?.id || null;
  if (date !== "") {
    date = JSON.parse(date);
  }
  const condition = {
    1: await getDataAffiliateByDay(7, userId),
    2: await getDataAffiliateByDay(30, userId),
    3: await getDataAffiliateByMonth("this", userId),
    4: await getDataAffiliateByMonth("last", userId),
    5: await getDataAffiliateBy3Month("this", userId),
    6: await getDataAffiliateBy3Month("last", userId),
    7: await getDataAffiliateThisYear(userId),
    8: await getDataAffiliateBySpecifyDate(date, userId),
  };

  res.status(200).json({
    success: true,
    data: condition[option],
  });
});
// =========================// =========================// =========================// =========================

const countAllBooking = async (startDate, endDate, afficondition, isMonth) => {
  const MainBookingCount = async (
    Model,
    startDate,
    endDate,
    afficondition,
    isMonth
  ) => {
    const dateCondition = isMonth
      ? [
          sequelize.fn("DATE_FORMAT", sequelize.col("CreationTime"), "%m/%Y"),
          "Date",
        ]
      : [Sequelize.fn("DATE", Sequelize.col("CreationTime")), "Date"];
    const dateGroup = isMonth
      ? [sequelize.fn("DATE_FORMAT", sequelize.col("CreationTime"), "%m/%Y")]
      : [Sequelize.fn("DATE", Sequelize.col("CreationTime"))];
    const data = await Model.findAll({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "Booking"],
        [Sequelize.fn("SUM", Sequelize.col("BookingValue")), "BookingValue"],
        dateCondition,
      ],
      where: {
        CreationTime: {
          [Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()],
        },
        PaymentStatus: {
          [Op.notIn]: [1],
        },
        ...afficondition,
      },
      group: dateGroup,
      raw: true,
    });
    return data;
  };
  return await Promise.all([
    MainBookingCount(StudioBooking, startDate, endDate, afficondition, isMonth),
    MainBookingCount(
      PhotographerBooking,
      startDate,
      endDate,
      afficondition,
      isMonth
    ),
    MainBookingCount(ModelBooking, startDate, endDate, afficondition, isMonth),
    MainBookingCount(MakeUpBooking, startDate, endDate, afficondition, isMonth),
  ]).then(
    ([studioBookings, photographerBookings, modelBookings, makeUpBookings]) => {
      const bookings = studioBookings.concat(
        photographerBookings,
        modelBookings,
        makeUpBookings
      );
      const optimizedBookings = bookings.reduce((acc, curr) => {
        const date = curr.Date;
        const existingBooking = acc.find((booking) => booking.Date === date);
        if (existingBooking) {
          existingBooking.Booking += +curr.Booking;
          existingBooking.BookingValue += +curr.BookingValue;
        } else {
          acc.push({ ...curr, BookingValue: +curr.BookingValue });
        }
        return acc;
      }, []);
      return optimizedBookings;
    }
  );
};
const countAllBookingSuccess = async (
  startDate,
  endDate,
  afficondition,
  isMonth
) => {
  const MainBookingCountSuccess = async (
    Model,
    startDate,
    endDate,
    afficondition,
    isMonth
  ) => {
    const dateCondition = isMonth
      ? [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn(
              "DATE_FORMAT",
              Sequelize.col("OrderByTimeTo"),
              "%m/%Y"
            ),
            Sequelize.fn("DATE_FORMAT", Sequelize.col("OrderByDateTo"), "%m/%Y")
          ),
          "Date",
        ]
      : [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("DATE", Sequelize.col("OrderByTimeTo")),
            Sequelize.fn("DATE", Sequelize.col("OrderByDateTo"))
          ),
          "Date",
        ];
    const dateGroup = isMonth
      ? [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn(
              "DATE_FORMAT",
              Sequelize.col("OrderByTimeTo"),
              "%m/%Y"
            ),
            Sequelize.fn("DATE_FORMAT", Sequelize.col("OrderByDateTo"), "%m/%Y")
          ),
        ]
      : [
          Sequelize.fn(
            "COALESCE",
            Sequelize.fn("DATE", Sequelize.col("OrderByTimeTo")),
            Sequelize.fn("DATE", Sequelize.col("OrderByDateTo"))
          ),
        ];
    const data = await Model.findAll({
      attributes: [
        dateCondition,
        [
          Sequelize.fn("SUM", Sequelize.col("AffiliateCommission")),
          "Commission",
        ],
      ],
      where: {
        [Sequelize.Op.or]: [
          {
            OrderByTimeTo: {
              [Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()],
            },
          },
          {
            OrderByDateTo: {
              [Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()],
            },
          },
        ],
        PaymentStatus: [2, 3, 4],
        BookingStatus: 1,
        ...afficondition,
      },
      group: dateGroup,
      raw: true,
    });

    return data;
  };
  return await Promise.all([
    MainBookingCountSuccess(
      StudioBooking,
      startDate,
      endDate,
      afficondition,
      isMonth
    ),
    MainBookingCountSuccess(
      PhotographerBooking,
      startDate,
      endDate,
      afficondition,
      isMonth
    ),
    MainBookingCountSuccess(
      ModelBooking,
      startDate,
      endDate,
      afficondition,
      isMonth
    ),
    MainBookingCountSuccess(
      MakeUpBooking,
      startDate,
      endDate,
      afficondition,
      isMonth
    ),
  ]).then(
    ([studioBookings, photographerBookings, modelBookings, makeUpBookings]) => {
      const bookings = studioBookings.concat(
        photographerBookings,
        modelBookings,
        makeUpBookings
      );
      const optimizedBookings = bookings.reduce((acc, curr) => {
        const date = curr.Date;
        const existingBooking = acc.find((booking) => booking.Date === date);
        if (existingBooking) {
          existingBooking.Commission += +curr.Commission;
        } else {
          acc.push({ ...curr, Commission: +curr.Commission });
        }
        return acc;
      }, []);
      return optimizedBookings;
    }
  );
};

async function getBookingsInLastDaysV2(numberOfDay, userId) {
  let afficondition = userId
    ? {
        AffiliateUserId: userId,
      }
    : {
        AffiliateUserId: {
          [Op.not]: null,
        },
      };

  const startDate = moment()
    .subtract(numberOfDay - 1, "days")
    .startOf("day");
  const endDate = moment().add(1, "days").endOf("day");

  const bookings = await countAllBooking(
    startDate,
    endDate,
    afficondition,
    false
  );
  const bookingSuccess = await countAllBookingSuccess(
    startDate,
    endDate,
    afficondition,
    false
  );
  const clicks = await AffiliateAccessCount.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("createdAt")), "Date"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "Click"],
    ],
    where: {
      createdAt: {
        [Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()],
      },
      ...afficondition,
    },
    group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
    raw: true,
  });

  const result = [];
  for (let i = 0; i < numberOfDay; i++) {
    const date = moment(startDate).add(i, "days").format("YYYY-MM-DD");
    const booking = bookings.find((b) => b.Date === date);
    const click = clicks.find((b) => b.Date === date);
    const affiliateCommissionValue = bookingSuccess.find(
      (b) => b.Date === date
    );
    result.push({
      Booking: booking ? parseInt(booking.Booking) : 0,
      Commission: affiliateCommissionValue
        ? parseInt(affiliateCommissionValue.Commission)
        : 0,
      Click: click ? parseInt(click.Click) : 0,
      BookingValue: booking ? parseInt(booking.BookingValue) : 0,
      Date: date,
    });
  }

  return result.map((val) => ({
    ...val,
    Date: moment(val.Date).format("DD/MM"),
  }));
}
async function getDataAffiliateByMonthV2(isThis, userId) {
  let afficondition = userId
    ? {
        AffiliateUserId: userId,
      }
    : {
        AffiliateUserId: {
          [Op.not]: null,
        },
      };
  const startDate =
    isThis === "this"
      ? moment().startOf("month")
      : moment().subtract(1, "months").startOf("month");
  const endDate =
    isThis === "this"
      ? moment().endOf("month")
      : moment().subtract(1, "months").endOf("month");

  const bookings = await countAllBooking(
    startDate,
    endDate,
    afficondition,
    false
  );
  const bookingSuccess = await countAllBookingSuccess(
    startDate,
    endDate,
    afficondition,
    false
  );
  const clicks = await AffiliateAccessCount.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("createdAt")), "Date"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "Click"],
    ],
    where: {
      createdAt: {
        [Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()],
      },
      ...afficondition,
    },
    group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
    raw: true,
  });

  const result = [];
  for (let i = 0; i < 30; i++) {
    const date = moment(startDate).add(i, "days").format("YYYY-MM-DD");
    const booking = bookings.find((b) => b.Date === date);
    const click = clicks.find((b) => b.Date === date);
    const affiliateCommissionValue = bookingSuccess.find(
      (b) => b.Date === date
    );

    result.push({
      Booking: booking ? parseInt(booking.Booking) : 0,
      Commission: affiliateCommissionValue
        ? parseInt(affiliateCommissionValue.Commission)
        : 0,
      Click: click ? parseInt(click.Click) : 0,
      BookingValue: booking ? parseInt(booking.BookingValue) : 0,
      Date: date,
    });
  }

  return result.map((val) => ({
    ...val,
    Date: moment(val.Date).format("DD/MM"),
  }));
}
async function getDataAffiliateBy3MonthV2(isThis, userId) {
  let afficondition = userId
    ? {
        AffiliateUserId: userId,
      }
    : {
        AffiliateUserId: {
          [Op.not]: null,
        },
      };
  const startDate =
    isThis === "this"
      ? moment().startOf("quarter")
      : moment().subtract(1, "quarters").startOf("quarter");
  const endDate =
    isThis === "this"
      ? moment().endOf("quarter")
      : moment().subtract(1, "quarters").endOf("quarter");

  const bookings = await countAllBooking(
    startDate,
    endDate,
    afficondition,
    true
  );
  const bookingSuccess = await countAllBookingSuccess(
    startDate,
    endDate,
    afficondition,
    true
  );
  const clicks = await AffiliateAccessCount.findAll({
    attributes: [
      [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%m/%Y"),
        "Date",
      ],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "Click"],
    ],
    where: {
      createdAt: {
        [Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()],
      },
      ...afficondition,
    },
    group: [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%m/%Y")],
    raw: true,
  });

  const result = [];
  for (let i = 0; i < 3; i++) {
    const date = moment(startDate).add(i, "months").format("MM/YYYY");
    const booking = bookings.find((b) => b.Date === date);
    const click = clicks.find((b) => b.Date === date);
    const affiliateCommissionValue = bookingSuccess.find(
      (b) => b.Date === date
    );

    result.push({
      Booking: booking ? parseInt(booking.Booking) : 0,
      Commission: affiliateCommissionValue
        ? parseInt(affiliateCommissionValue.Commission)
        : 0,
      Click: click ? parseInt(click.Click) : 0,
      BookingValue: booking ? parseInt(booking.BookingValue) : 0,
      Date: date,
    });
  }

  return result;
}
async function getDataAffiliateThisYearV2(userId) {
  let afficondition = userId
    ? {
        AffiliateUserId: userId,
      }
    : {
        AffiliateUserId: {
          [Op.not]: null,
        },
      };
  const startDate = moment().startOf("year");
  const endDate = moment().endOf("year");
  const bookings = await countAllBooking(
    startDate,
    endDate,
    afficondition,
    true
  );

  const bookingSuccess = await countAllBookingSuccess(
    startDate,
    endDate,
    afficondition,
    true
  );
  const clicks = await AffiliateAccessCount.findAll({
    attributes: [
      [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%m/%Y"),
        "Date",
      ],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "Click"],
    ],
    where: {
      createdAt: {
        [Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()],
      },
      ...afficondition,
    },
    group: [sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%m/%Y")],
    raw: true,
  });

  const result = [];
  for (let i = 0; i < 12; i++) {
    const date = moment(startDate).add(i, "months").format("MM/YYYY");
    const booking = bookings.find((b) => b.Date === date);
    const click = clicks.find((b) => b.Date === date);
    const affiliateCommissionValue = bookingSuccess.find(
      (b) => b.Date === date
    );

    result.push({
      Booking: booking ? parseInt(booking.Booking) : 0,
      Commission: affiliateCommissionValue
        ? parseInt(affiliateCommissionValue.Commission)
        : 0,
      Click: click ? parseInt(click.Click) : 0,
      BookingValue: booking ? parseInt(booking.BookingValue) : 0,
      Date: date,
    });
  }

  return result;
}
async function getDataAffiliateBySpecifyDateV2(date, userId) {
  let afficondition = userId
    ? {
        AffiliateUserId: userId,
      }
    : {
        AffiliateUserId: {
          [Op.not]: null,
        },
      };
  const startDate = moment(date.startDate).startOf("days");
  const endDate = moment(date.endDate).endOf("days");
  const bookings = await countAllBooking(
    startDate,
    endDate,
    afficondition,
    false
  );
  const bookingSuccess = await countAllBookingSuccess(
    startDate,
    endDate,
    afficondition,
    false
  );
  const clicks = await AffiliateAccessCount.findAll({
    attributes: [
      [Sequelize.fn("DATE", Sequelize.col("createdAt")), "Date"],
      [Sequelize.fn("COUNT", Sequelize.col("id")), "Click"],
    ],
    where: {
      createdAt: {
        [Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()],
      },
      ...afficondition,
    },
    group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
    raw: true,
  });
  const diffInDays = endDate.diff(startDate, "days");
  const result = [];
  for (let i = 0; i < diffInDays + 1; i++) {
    const date = moment(startDate).add(i, "days").format("YYYY-MM-DD");
    const booking = bookings.find((b) => b.Date === date);
    const click = clicks.find((b) => b.Date === date);
    const affiliateCommissionValue = bookingSuccess.find(
      (b) => b.Date === date
    );

    result.push({
      Booking: booking ? parseInt(booking.Booking) : 0,
      Commission: affiliateCommissionValue
        ? parseInt(affiliateCommissionValue.Commission)
        : 0,
      Click: click ? parseInt(click.Click) : 0,
      BookingValue: booking ? parseInt(booking.BookingValue) : 0,
      Date: date,
    });
  }

  return result.map((val) => ({
    ...val,
    Date: moment(val.Date).format("DD/MM"),
  }));
}

exports.getAffiliateDataVer2 = catchAsync(async (req, res) => {
  let { option = 1, date } = req.query;
  const userId = req?.user?.id || null;
  if (date !== "") {
    date = JSON.parse(date);
  }

  const condition = {
    1: await getBookingsInLastDaysV2(7, userId),
    2: await getBookingsInLastDaysV2(30, userId),
    3: await getDataAffiliateByMonthV2("this", userId),
    4: await getDataAffiliateByMonthV2("last", userId),
    5: await getDataAffiliateBy3MonthV2("this", userId),
    6: await getDataAffiliateBy3MonthV2("last", userId),
    7: await getDataAffiliateThisYearV2(userId),
    8: await getDataAffiliateBySpecifyDateV2(date, userId),
  };

  res.status(200).json({
    success: true,
    data: condition[option],
  });
});

// =========================// =========================// =========================// =========================
const countAllBookingPartner = async (date, userId) => {
  const startDate =
    date !== ""
      ? moment(date.startDate).startOf("days")
      : moment("2019-18-01T18:28:13Z").startOf("days");
  const endDate = moment(date.endDate).endOf("days");
  const MainBookingCount = async (Model, startDate, endDate, userId) => {
    const dateCondition = [
      Sequelize.fn("DATE", Sequelize.col("CreationTime")),
      "Date",
    ];
    const dateGroup = [Sequelize.fn("DATE", Sequelize.col("CreationTime"))];
    const data = await Model.findAll({
      attributes: [
        [Sequelize.fn("COUNT", Sequelize.col("id")), "Booking"],
        [Sequelize.fn("SUM", Sequelize.col("BookingValue")), "BookingValue"],
        dateCondition,
      ],
      where: {
        CreationTime: {
          [Sequelize.Op.between]: [startDate.toDate(), endDate.toDate()],
        },
        PaymentStatus: {
          [Op.notIn]: [1],
        },
        TenantId: userId,
      },
      group: dateGroup,
      raw: true,
    });
    return data;
  };
  return await Promise.all([
    MainBookingCount(StudioBooking, startDate, endDate, userId),
    MainBookingCount(PhotographerBooking, startDate, endDate, userId),
    MainBookingCount(ModelBooking, startDate, endDate, userId),
    MainBookingCount(MakeUpBooking, startDate, endDate, userId),
  ]).then(
    ([studioBookings, photographerBookings, modelBookings, makeUpBookings]) => {
      const studioTotal = studioBookings.reduce(
        (acc, booking) => acc + +booking.BookingValue,
        0
      );
      const photographerTotal = photographerBookings.reduce(
        (acc, booking) => acc + +booking.BookingValue,
        0
      );
      const modelTotal = modelBookings.reduce(
        (acc, booking) => acc + +booking.BookingValue,
        0
      );
      const makeUpTotal = makeUpBookings.reduce(
        (acc, booking) => acc + +booking.BookingValue,
        0
      );
      return [
        {
          label: "Studio",
          total: Math.round(studioTotal / 1000000),
        },
        {
          label: "Photograp",
          total: Math.round(photographerTotal / 1000000),
        },
        {
          label: "Model",
          total: Math.round(modelTotal / 1000000),
        },
        {
          label: "Make Up",
          total: Math.round(makeUpTotal / 1000000),
        },
        {
          label: "Device",
          total: Math.round(40000000 / 1000000),
        },
        {
          label: "Clothes",
          total: Math.round(23000000 / 1000000),
        },
      ];
    }
  );
};

exports.getPartnerDataBarChart = catchAsync(async (req, res) => {
  let { date = "" } = req.query;
  const userId = req?.user?.id || 64;
  if (date !== "") {
    date = JSON.parse(date);
  }
  const condition = {
    69: await countAllBookingPartner(date, userId),
  };
  res.status(200).json({
    success: true,
    data: condition[69],
  });
});
