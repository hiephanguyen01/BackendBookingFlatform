const moment = require("moment");
const { Op } = require("sequelize");
const {
  StudioBooking,
  MakeUpBooking,
  PhotographerBooking,
  ClothesBooking,
  DeviceBooking,
  ModelBooking,
} = require("../models");

const SyncCancelBooking = async () => {
  await updateBooking(StudioBooking);
  await updateBooking(PhotographerBooking);
  await updateBooking(ClothesBooking);
  await updateBooking(DeviceBooking);
  await updateBooking(MakeUpBooking);
  await updateBooking(ModelBooking);
};

const updateBooking = async (ModelABooking) => {
  try {
    await ModelABooking.update(
      {
        BookingStatus: 2,
        DeletedNote: "Quá hạn thanh toán",
        DeletionTime: moment(),
      },
      {
        where: {
          CreationTime: {
            [Op.lt]: moment().utc().subtract(30, "minutes"),
          },
          PaymentStatus: 1,
          BookingStatus: 4,
        },
      }
    );
  } catch (error) {
    console.log("🚀 ~ updateBooking ~ error:", error);
  }
};

module.exports = SyncCancelBooking;
