const sequelize = require("sequelize");
const { Op } = require("sequelize");
const {
  RegisterPartner,
  MakeupPost,
  ModelPost,
  StudioPost,
  PhotographerPost,
  ClothesPost,
  DevicePost,
  BookingUser,
  StudioBooking,
  MakeUpBooking,
  PhotographerBooking,
  ClothesBooking,
  DeviceBooking,
  ModelBooking,
  StatisticData,
  StatisticDataWeek,
  StatisticDataDaily,
} = require("../models");
const moment = require("moment");

const SyncStatistic = async () => {
  const day = "2023-07-21";
  const Year = new Date(day).getFullYear();
  const Month = new Date(day).getMonth() + 1;
  const prevMonday = new Date(day);
  prevMonday.setDate(prevMonday.getDate() - ((prevMonday.getDay() + 6) % 7));
  const nextMonday = new Date(day);
  nextMonday.setDate(prevMonday.getDate() + 7);

  const startDay = new Date(day).setUTCHours(0, 0, 0, 0);
  const endDay = new Date(day).setUTCHours(23, 59, 59, 999);

  const DailyCondition = {
    where: {
      CreationTime: {
        [Op.between]: [startDay, endDay],
      },
    },
  };
  const SSDailyCondition = {
    where: {
      [Op.or]: [
        {
          OrderByTimeTo: {
            [Op.between]: [startDay, endDay],
          },
        },
        {
          OrderByDateTo: {
            [Op.between]: [startDay, endDay],
          },
        },
      ],
      BookingStatus: 1,
      // PaymentStatus: [2, 3, 4],
    },
  };
  const FDailyCondition = {
    where: {
      [Op.or]: {
        DeletionTime: {
          [Op.between]: [startDay, endDay],
        },
      },
      BookingStatus: [2, 3],
    },
  };

  const WeeklyCondition = {
    where: {
      CreationTime: {
        [Op.between]: [prevMonday, nextMonday],
      },
    },
  };
  const mothAndYearCondition = {
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
  const SSmothAndYearCondition = {
    where: {
      [Op.or]: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("OrderByTimeTo")),
            Month
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("OrderByTimeTo")),
            Year
          ),
        ],
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("OrderByDateTo")),
            Month
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("OrderByDateTo")),
            Year
          ),
        ],
      },
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
  };
  const FmothAndYearCondition = {
    where: {
      [Op.or]: {
        [Op.and]: [
          sequelize.where(
            sequelize.fn("MONTH", sequelize.col("DeletionTime")),
            Month
          ),
          sequelize.where(
            sequelize.fn("YEAR", sequelize.col("DeletionTime")),
            Year
          ),
        ],
      },
      BookingStatus: [2, 3],
    },
  };
  // //Partner
  const Partner = await RegisterPartner.count();
  const MonthPartner = await RegisterPartner.count(mothAndYearCondition);
  const PartnerByCategory = {
    MakeUp: await MakeupPost.count({
      ...mothAndYearCondition,
      distinct: true,
      col: "MakeupPost.TenantId",
    }),
    Model: await ModelPost.count({
      ...mothAndYearCondition,
      distinct: true,
      col: "ModelPost.TenantId",
    }),
    Studio: await StudioPost.count({
      ...mothAndYearCondition,
      distinct: true,
      col: "StudioPost.TenantId",
    }),
    Photographer: await PhotographerPost.count({
      ...mothAndYearCondition,
      distinct: true,
      col: "PhotographerPost.TenantId",
    }),
    Clothes: await ClothesPost.count({
      ...mothAndYearCondition,
      distinct: true,
      col: "ClothesPost.TenantId",
    }),
    Device: await DevicePost.count({
      ...mothAndYearCondition,
      distinct: true,
      col: "DevicePost.TenantId",
    }),
  };
  const WeekPartner = await RegisterPartner.count(WeeklyCondition);
  const WeekPartnerByCategory = {
    MakeUp: await MakeupPost.count({
      ...WeeklyCondition,
      distinct: true,
      col: "MakeupPost.TenantId",
    }),
    Model: await ModelPost.count({
      ...WeeklyCondition,
      distinct: true,
      col: "ModelPost.TenantId",
    }),
    Studio: await StudioPost.count({
      ...WeeklyCondition,
      distinct: true,
      col: "StudioPost.TenantId",
    }),
    Photographer: await PhotographerPost.count({
      ...WeeklyCondition,
      distinct: true,
      col: "PhotographerPost.TenantId",
    }),
    Clothes: await ClothesPost.count({
      ...WeeklyCondition,
      distinct: true,
      col: "ClothesPost.TenantId",
    }),
    Device: await DevicePost.count({
      ...WeeklyCondition,
      distinct: true,
      col: "DevicePost.TenantId",
    }),
  };

  const DailyPartner = await RegisterPartner.count(DailyCondition);
  const DailyPartnerByCategory = {
    MakeUp: await MakeupPost.count({
      ...DailyCondition,
      distinct: true,
      col: "MakeupPost.TenantId",
    }),
    Model: await ModelPost.count({
      ...DailyCondition,
      distinct: true,
      col: "ModelPost.TenantId",
    }),
    Studio: await StudioPost.count({
      ...DailyCondition,
      distinct: true,
      col: "StudioPost.TenantId",
    }),
    Photographer: await PhotographerPost.count({
      ...DailyCondition,
      distinct: true,
      col: "PhotographerPost.TenantId",
    }),
    Clothes: await ClothesPost.count({
      ...DailyCondition,
      distinct: true,
      col: "ClothesPost.TenantId",
    }),
    Device: await DevicePost.count({
      ...DailyCondition,
      distinct: true,
      col: "DevicePost.TenantId",
    }),
  };
  // //Post
  const PostByCategory = {
    MakeUp: await MakeupPost.count(),
    Model: await ModelPost.count(),
    Studio: await StudioPost.count(),
    Photographer: await PhotographerPost.count(),
    Clothes: await ClothesPost.count(),
    Device: await DevicePost.count(),
  };
  const PostByMonth = {
    MakeUp: await MakeupPost.count(mothAndYearCondition),
    Model: await ModelPost.count(mothAndYearCondition),
    Studio: await StudioPost.count(mothAndYearCondition),
    Photographer: await PhotographerPost.count(mothAndYearCondition),
    Clothes: await ClothesPost.count(mothAndYearCondition),
    Device: await DevicePost.count(mothAndYearCondition),
  };

  const PostByWeek = {
    MakeUp: await MakeupPost.count(WeeklyCondition),
    Model: await ModelPost.count(WeeklyCondition),
    Studio: await StudioPost.count(WeeklyCondition),
    Photographer: await PhotographerPost.count(WeeklyCondition),
    Clothes: await ClothesPost.count(WeeklyCondition),
    Device: await DevicePost.count(WeeklyCondition),
  };
  const PostByDay = {
    MakeUp: await MakeupPost.count(DailyCondition),
    Model: await ModelPost.count(DailyCondition),
    Studio: await StudioPost.count(DailyCondition),
    Photographer: await PhotographerPost.count(DailyCondition),
    Clothes: await ClothesPost.count(DailyCondition),
    Device: await DevicePost.count(DailyCondition),
  };
  // //BookingUser
  const BookingUsers = await BookingUser.count();
  const BookingUserByMonth = await BookingUser.count(mothAndYearCondition);
  const BookingUserByWeek = await BookingUser.count(WeeklyCondition);
  const BookingUserByDay = await BookingUser.count(DailyCondition);
  //Order
  const BookingByMonth = await StudioBooking.count(mothAndYearCondition);
  const BookingSuccess = await StudioBooking.count({
    ...SSmothAndYearCondition,
  });
  const BookingFail = await StudioBooking.count({
    ...FmothAndYearCondition,
  });

  const BookingByWeek = await StudioBooking.count(WeeklyCondition);
  const BookingSuccessWeek = await StudioBooking.count({
    ...WeeklyCondition,
    where: {
      ...WeeklyCondition.where,
      BookingStatus: 1,
      PaymentStatus: [2, 3, 4],
    },
  });
  const BookingFailWeek = await StudioBooking.count({
    ...WeeklyCondition,
    where: {
      ...WeeklyCondition.where,
      BookingStatus: [2, 3],
    },
  });
  const BookingByDay = await StudioBooking.count(DailyCondition);
  const BookingSuccessDay = await StudioBooking.count(SSDailyCondition);
  const BookingFailDay = await StudioBooking.count(FDailyCondition);
  //
  const rawValueOfBookingByDay = await StudioBooking.findAll({
    ...DailyCondition,
    attributes: ["BookingValue"],
  });
  const ValueOfBookingByDay = rawValueOfBookingByDay.reduce((acc, val) => {
    return acc + val.dataValues.BookingValue;
  }, 0);
  //
  const rawValueOfBookingByMonth = await StudioBooking.findAll({
    ...mothAndYearCondition,
    attributes: ["BookingValue"],
  });
  const ValueOfBookingByMonth = rawValueOfBookingByMonth.reduce((acc, val) => {
    return acc + val.dataValues.BookingValue;
  }, 0);
  //
  const rawValueOfBookingByWeek = await StudioBooking.findAll({
    ...WeeklyCondition,
    attributes: ["BookingValue"],
  });
  const ValueOfBookingByWeek = rawValueOfBookingByWeek.reduce((acc, val) => {
    return acc + val.dataValues.BookingValue;
  }, 0);
  //number of Booking
  const NumberOfBookingAll = {
    MakeUp: await MakeUpBooking.count(),
    Model: await ModelBooking.count(),
    Studio: await StudioBooking.count(),
    Photographer: await PhotographerBooking.count(),
    Clothes: await ClothesBooking.count(),
    Device: await DeviceBooking.count(),
  };
  const rawTotalBookingValue = {
    MakeUp: await MakeUpBooking.findAll({
      attributes: ["BookingValue"],
    }),
    Model: await ModelBooking.findAll({
      attributes: ["BookingValue"],
    }),
    Studio: await StudioBooking.findAll({
      attributes: ["BookingValue"],
    }),
    Photographer: await PhotographerBooking.findAll({
      attributes: ["BookingValue"],
    }),
    Clothes: await ClothesBooking.findAll({
      attributes: ["BookingValue"],
    }),
    Device: await DeviceBooking.findAll({
      attributes: ["BookingValue"],
    }),
  };
  const TotalBookingValue = Object.fromEntries(
    Object.entries(rawTotalBookingValue).map((item) => {
      const val = item[0];
      const total = item[1].reduce((acc, val) => {
        return acc + val.dataValues.BookingValue;
      }, 0);
      return [val, total];
    })
  );

  const checkerMonth = await StatisticData.findOne({
    where: {
      [Op.and]: [{ Month: Month }, { Year: Year }],
    },
  });
  if (!checkerMonth) {
    await StatisticData.create({
      Month,
      Year,
      Partner,
      MonthPartner,
      PartnerByCategory: JSON.stringify(PartnerByCategory),
      PostByMonth: JSON.stringify(PostByMonth),
      PostByCategory: JSON.stringify(PostByCategory),
      BookingUser: BookingUsers,
      BookingUserByMonth,
      BookingByMonth,
      BookingSuccess,
      BookingFail,
      ValueOfBookingByMonth,
      TotalBookingValue: JSON.stringify(TotalBookingValue),
      NumberOfBookingAll: JSON.stringify(NumberOfBookingAll),
    });
  } else {
    await StatisticData.update(
      {
        Month,
        Year,
        Partner,
        MonthPartner,
        PartnerByCategory: JSON.stringify(PartnerByCategory),
        PostByMonth: JSON.stringify(PostByMonth),
        PostByCategory: JSON.stringify(PostByCategory),
        BookingUser: BookingUsers,
        BookingUserByMonth,
        BookingByMonth,
        BookingSuccess,
        BookingFail,
        ValueOfBookingByMonth,
        TotalBookingValue: JSON.stringify(TotalBookingValue),
        NumberOfBookingAll: JSON.stringify(NumberOfBookingAll),
      },
      {
        where: {
          id: checkerMonth.dataValues.id,
        },
      }
    );
  }

  const checkerWeek = await StatisticDataWeek.findOne({
    where: {
      To: {
        [Op.gte]: new Date(),
      },
    },
  });
  if (!checkerWeek) {
    await StatisticDataWeek.create({
      From: prevMonday,
      To: nextMonday,
      Partner,
      WeekPartner,
      PartnerByCategory: JSON.stringify(WeekPartnerByCategory),
      PostByWeek: JSON.stringify(PostByWeek),
      PostByCategory: JSON.stringify(PostByCategory),
      BookingUser: BookingUsers,
      BookingUserByWeek,
      BookingByWeek,
      BookingSuccessWeek,
      BookingFailWeek,
      ValueOfBookingByWeek,
    });
  } else {
    await StatisticDataWeek.update(
      {
        Partner,
        WeekPartner,
        PartnerByCategory: JSON.stringify(WeekPartnerByCategory),
        PostByWeek: JSON.stringify(PostByWeek),
        PostByCategory: JSON.stringify(PostByCategory),
        BookingUser: BookingUsers,
        BookingUserByWeek,
        BookingByWeek,
        BookingSuccess: BookingSuccessWeek,
        BookingFail: BookingFailWeek,
        ValueOfBookingByWeek,
      },
      {
        where: {
          id: checkerWeek.dataValues.id,
        },
      }
    );
  }

  const checkerDay = await StatisticDataDaily.findOne({
    where: {
      Date: {
        [Op.between]: [startDay, endDay],
      },
    },
  });
  if (!checkerDay) {
    await StatisticDataDaily.create({
      Date: startDay,
      Partner,
      DailyPartner,
      PartnerByCategory: JSON.stringify(DailyPartnerByCategory),
      PostByDay: JSON.stringify(PostByDay),
      PostByCategory: JSON.stringify(PostByCategory),
      BookingUser: BookingUsers,
      BookingUserByDay,
      BookingByDay,
      BookingSuccess: BookingSuccessDay,
      BookingFail: BookingFailDay,
      ValueOfBookingByDay,
    });
  } else {
    await StatisticDataDaily.update(
      {
        Partner,
        DailyPartner,
        PartnerByCategory: JSON.stringify(DailyPartnerByCategory),
        PostByDay: JSON.stringify(PostByDay),
        PostByCategory: JSON.stringify(PostByCategory),
        BookingUser: BookingUsers,
        BookingUserByDay,
        BookingByDay,
        BookingSuccess: BookingSuccessDay,
        BookingFail: BookingFailDay,
        ValueOfBookingByDay,
      },
      {
        where: {
          id: checkerDay.dataValues.id,
        },
      }
    );
  }
};
module.exports = SyncStatistic;
