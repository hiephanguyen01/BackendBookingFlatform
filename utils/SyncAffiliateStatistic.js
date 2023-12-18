const sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = require("sequelize");
const {
  StudioBooking,
  PhotographerBooking,
  ClothesBooking,
  MakeUpBooking,
  DeviceBooking,
  ModelBooking,
  AffiliateUser,
  AffiliatePayment,
  Sequelize,
} = require("../models");
const moment = require("moment");
const AffiliateSyncStatistic = async () => {
  const affiliateUsers = await AffiliateUser.findAll({
    attributes: ["id", "isPersonal"],
    raw: true,
  });

  for (const user of affiliateUsers) {
    await computeAffiliatePayment(user.id, user.isPersonal);
  }
};
module.exports = AffiliateSyncStatistic;

const computeAffiliatePayment = async (AffiliateUserId, isPersonal) => {
  const defautValueCompare = 2000000;
  const thisPeriod = moment().subtract(1, "months").startOf("month");
  const commissionThisPeriod = await getDataAffiliateByMonthV2(
    "",
    AffiliateUserId
  );
  const check = await AffiliatePayment.findOne({
    where: {
      period: thisPeriod.utc(),
      AffiliateUserId,
    },
    raw: true,
  });
  const accumulatedUnpaidCommissions = async () => {
    const lastPeriod = moment().subtract(2, "months").startOf("month");
    const AffiliatePaymentLastPeriod = await AffiliatePayment.findOne({
      where: {
        period: lastPeriod.utc(),
        AffiliateUserId,
      },
      raw: true,
    });
    return (
      commissionThisPeriod +
      (AffiliatePaymentLastPeriod?.commissionNextPeriod || 0)
    );
  };
  const unpaidLastPeriod = async () => {
    const lastPeriod = moment().subtract(2, "months").startOf("month");
    const AffiliatePaymentLastPeriod = await AffiliatePayment.findOne({
      where: {
        period: lastPeriod.utc(),
        AffiliateUserId,
      },
      raw: true,
    });
    return AffiliatePaymentLastPeriod?.commissionNextPeriod || 0;
  };
  const TNCN = (isPersonal) => {
    if (isPersonal) {
      return commissionThisPeriod > defautValueCompare
        ? commissionThisPeriod * 0.1
        : 0;
    } else {
      return 0;
    }
  };
  const commissionPaidThisPeriod = async (isPersonal) => {
    if (isPersonal) {
      return (await accumulatedUnpaidCommissions()) > defautValueCompare
        ? (await accumulatedUnpaidCommissions()) - TNCN(isPersonal)
        : 0;
    } else {
      return 0;
    }
  };
  const commissionNextPeriod = async (isPersonal) => {
    return (
      (await accumulatedUnpaidCommissions()) -
      TNCN(isPersonal) -
      (await commissionPaidThisPeriod(isPersonal))
    );
  };

  if (check) {
    await AffiliatePayment.update(
      {
        commissionThisPeriod,
        unpaidLastPeriod: await unpaidLastPeriod(),
        accumulatedUnpaidCommissions: await accumulatedUnpaidCommissions(),
        TNCN: TNCN(isPersonal),
        commissionPaidThisPeriod: await commissionPaidThisPeriod(isPersonal),
        commissionNextPeriod: await commissionNextPeriod(isPersonal),
      },
      {
        where: {
          id: check.id,
          AffiliateUserId,
        },
      }
    );
  } else {
    await AffiliatePayment.create({
      period: thisPeriod,
      commissionThisPeriod,
      unpaidLastPeriod: await unpaidLastPeriod(),
      accumulatedUnpaidCommissions: await accumulatedUnpaidCommissions(),
      TNCN: TNCN(isPersonal),
      commissionPaidThisPeriod: await commissionPaidThisPeriod(isPersonal),
      commissionNextPeriod: await commissionNextPeriod(isPersonal),
      payDate: moment().date(15).startOf("date"),
      payStatus: 0,
      AffiliateUserId,
    });
  }
};

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

  const bookingSuccess = await countAllBookingSuccess(
    startDate,
    endDate,
    afficondition,
    false
  );
  return bookingSuccess.reduce((acc, val) => val.Commission + acc, 0);
}
const countAllBookingSuccess = async (startDate, endDate, afficondition) => {
  const MainBookingCountSuccess = async (
    Model,
    startDate,
    endDate,
    afficondition
  ) => {
    const data = await Model.findAll({
      attributes: [
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
      raw: true,
    });
    return data;
  };
  return await Promise.all([
    MainBookingCountSuccess(StudioBooking, startDate, endDate, afficondition),
    MainBookingCountSuccess(
      PhotographerBooking,
      startDate,
      endDate,
      afficondition
    ),
    MainBookingCountSuccess(ModelBooking, startDate, endDate, afficondition),
    MainBookingCountSuccess(MakeUpBooking, startDate, endDate, afficondition),
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
