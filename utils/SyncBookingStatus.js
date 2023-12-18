const moment = require("moment");
const { Op } = require("sequelize");
const _ = require("lodash");

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
  AffiliateProduct,
  MakeUpBooking,
  PhotographerBooking,
  ClothesBooking,
  DeviceBooking,
  ModelBooking,
  AffiliateStatisticDaily,
} = require("../models");
const SyncBookingStatus = async () => {
  await AffiliateStatisticProduct(StudioBooking, 1, "StudioBooking");
  await AffiliateStatisticProduct(
    PhotographerBooking,
    2,
    "PhotographerBooking"
  );
  await AffiliateStatisticProduct(MakeUpBooking, 4, "MakeUpBooking");
  await AffiliateStatisticProduct(ModelBooking, 6, "ModelBooking");

  const partners = await RegisterPartner.findAll({
    attributes: ["Id", "TenantId"],
    raw: true,
  });

  for (const id of _.map(partners, "TenantId")) {
    await findAndUpdateBookingCount(id, StudioBooking, StudioPost);
    await findAndUpdateBookingCount(id, PhotographerBooking, PhotographerPost);
    await findAndUpdateBookingCount(id, ClothesBooking, ClothesPost);
    await findAndUpdateBookingCount(id, DeviceBooking, DevicePost);
    await findAndUpdateBookingCount(id, MakeUpBooking, MakeupPost);
    await findAndUpdateBookingCount(id, ModelBooking, ModelPost);
  }
};

const AffiliateStatisticProduct = async (Booking, category, a) => {
  const endOfYesterday = moment()
    .startOf("day")
    .subtract(1, "days")
    .endOf("day");
  const rawValueOfBookingByDay = await Booking.findAll({
    where: {
      [Op.or]: {
        OrderByTimeTo: {
          [Op.between]: [
            moment("09/02/1979", "MM/DD/YYYY").utc(),
            endOfYesterday,
          ],
        },
        OrderByDateTo: {
          [Op.between]: [
            moment("09/02/1979", "MM/DD/YYYY").utc(),
            endOfYesterday,
          ],
        },
      },
      BookingStatus: 4,
      PaymentStatus: [2, 3, 4],
    },
    order: [["Id", "DESC"]],
    attributes: ["Id", "AffiliateUserId", "TenantId", "AffiliateCommission"],
  });

  const ValueOfBookingByDay = _.map(rawValueOfBookingByDay, (data) => ({
    OrderId: data.toJSON().Id,
    affiliateUserId: data.toJSON().AffiliateUserId,
    category,
  }));

  //các đơn đặt của affiliate user
  // const affiliateBooking = _.filter(
  //   ValueOfBookingByDay,
  //   (data) => data.affiliateUserId
  // );
  // Update đơn thành công
  await Booking.update(
    {
      BookingStatus: 1,
    },
    { where: { Id: _.map(ValueOfBookingByDay, "OrderId") } }
  );
  // if (affiliateBooking.length) {
  //   await AffiliateProduct.bulkCreate(affiliateBooking, {
  //     returning: true,
  //   });
  // }
};

const findAndUpdateBookingCount = async (
  TenantId,
  ModelABooking,
  ModelAPost
) => {
  const count = await ModelABooking.count({
    where: {
      TenantId: TenantId,
      BookingStatus: 1,
    },
  });
  await ModelAPost.update(
    {
      BookingCount: count,
    },
    { where: { TenantId: TenantId } }
  );
};

module.exports = SyncBookingStatus;
