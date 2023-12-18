const {
  RegisterPartner,
  StudioPost,
  PhotographerPost,
  MakeupPost,
  ClothesPost,
  ModelPost,
  DevicePost,
  WordKey,
  StudioPost_User,
  ClothesPost_User,
  PhotographerPost_User,
  MakeupPost_User,
  DevicePost_User,
  ModelPost_User,
  PostReport,
  PhotographerServicePackage,
  StudioRoom,
  StudioBooking,
  SaleCode,
  sequelize,
  SecurityQuestion,
} = require("../models");
const { BookingUser } = require("../models");
const baseController = require("../utils/BaseController");
const { Op } = require("sequelize");
const catchAsync = require("../middlewares/async");
const moment = require("moment");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");
const {
  createWebHookEvents,
  createWebHookSendAttempts,
} = require("./adminWebhook");
const {
  downloadCustomerExcel,
  downloadPartnerExcel,
  downloadPostExcel,
  downloadOrderExcel,
  downloadCommissionExcel,
} = require("./exportDataController");

function handlerPaymentStatus(value) {
  switch (Number(value)) {
    case 1:
      return "Chờ thanh toán";
    case 2:
      return "Đã cọc";
    case 3:
      return "Đã thanh toán";
    case 4:
      return "null";

    default:
      break;
  }
}
exports.filterOption = catchAsync(async (req, res) => {
  let {
    option,
    IsDeleted,
    ProvinceId,
    createDate,
    isStatus,
    IdentifyCode,
    studioPostId,
  } = req.query;
  let options = {};
  let orderOption = {};
  if (studioPostId !== "") {
    orderOption["StudioPostId"] = studioPostId;
  }
  if (createDate) {
    createDate = JSON.parse(createDate);
  }
  if (IsDeleted) {
    IsDeleted = IsDeleted == "true";
  }

  if (ProvinceId) {
    ProvinceId = +ProvinceId;
  }
  if (createDate?.startDate !== "" || createDate?.endDate !== "") {
    options = {
      ...options,
      CreationTime: {
        [Op.gte]: moment(createDate.startDate.replace(/\s/g, "+")),
        // [Op.gte]: createDate.startDate,
        [Op.lte]: moment(createDate.endDate.replace(/\s/g, "+")),
      },
    };
  }
  if (IsDeleted !== "") {
    options["IsDeleted"] = IsDeleted;
  }
  if (ProvinceId) {
    options["ProvinceId"] = ProvinceId;
  }
  if (IdentifyCode) {
    options["IdentifyCode"] = IdentifyCode;
  }
  if (isStatus !== "") {
    if (isStatus == 1) {
      options["BookingStatus"] = 1;
      options["PaymentStatus"] = { [Op.or]: [3, 4] };
    } else {
      options["BookingStatus"] = 2;
    }
  }

  let data = [];
  switch (option) {
    case "1":
      //Tai khoan doi tac
      data = await RegisterPartner.findAll({
        where: options,
        // attributes: [
        //   "id",
        //   "PartnerName",
        //   "Phone",
        //   "Email",
        //   "RepresentativeName",
        //   "BusinessRegistrationLicenseNumber",
        //   "Address",
        //   "CreationTime",
        //   "LastModificationTime",
        //   "IsDeleted",
        //   "Note",
        //   "PostCount",
        //   "CommissionRate",
        //   "BankId",
        //   "BankBranchName",
        //   "BankAccountOwnerName",
        //   "BankAccount",
        //   "TenantId",
        // ],
        include: [
          { model: SecurityQuestion, as: "SecurityQuestion1" },
          { model: SecurityQuestion, as: "SecurityQuestion2" },
          { model: SecurityQuestion, as: "SecurityQuestion3" },
        ],
      });
      data = await Promise.all(
        data.map(async (item) => {
          let IsDeleted = item.IsDeleted == true ? "Đóng" : "Mở";
          let LastModificationTime = item.LastModificationTime
            ? item.LastModificationTime
            : item.CreationTime;

          return {
            ...item.dataValues,
            Id: `PAR-${("0000000000" + item.TenantId).slice(-10)}`,
            IsDeleted,
            LastModificationTime,
            SecurityQuestion1: item?.SecurityQuestion1?.Question,
            SecurityQuestion2: item?.SecurityQuestion2?.Question,
            SecurityQuestion3: item?.SecurityQuestion3?.Question,
            bookingCount: await StudioBooking.count({
              where: {
                TenantId: item.TenantId,
              },
            }),
          };
        })
      );
      // res.status(200).json(data);
      return downloadPartnerExcel(data, res);
    case "2":
      //Tai khoan khach hang
      data = await BookingUser.findAll({
        where: options,
        attributes: [
          "id",
          "Fullname",
          "Phone",
          "Email",
          "ZaloName",
          "FacebookLastname",
          "CreationTime",
          "LastModificationTime",
          "IsDeleted",
          "FacebookFirstname",
          "Note",
          "GoogleEmail",
        ],
      });
      // res.status(200).json({ data });
      data = data.map((item) => {
        let Email = item.Email == null ? item.GoogleEmail : item.Email;
        let IsDeleted = item.IsDeleted == true ? "Đã xoá" : "Active";
        let LastModificationTime = item.LastModificationTime
          ? item.LastModificationTime
          : item.CreationTime;
        return {
          ...item.dataValues,
          id: `CUS-${("0000000000" + item.dataValues.id).slice(-10)}`,
          fbFullname:
            item.dataValues.FacebookFirstname +
            " " +
            item.dataValues.FacebookLastname,
          Email,
          IsDeleted,
          LastModificationTime,
        };
      });
      return downloadCustomerExcel(data, res);
    // res.status(200).json({ data });

    case "4": {
      data = await PhotographerPost.findAll({
        where: options,
        attributes: [
          "Id",
          "Name",
          "Address",
          "BookingCount",
          "CreationTime",
          "LastModificationTime",
          "IsVisible",
          "Note",
          "TotalRate",
          "TenantId",
          "OpenMorningHour",
          "OpenAfternoonHour",
          "OpenMorningMinutes",
          "OpenAfternoonMinutes",
          "CloseMorningHour",
          "CloseMorningMinutes",
          "CloseAfternoonHour",
          "CloseAfternoonMinutes",
        ],
      });
      data = await Promise.all(
        data.map(async (obj) => {
          let OpenMorning = `${obj.OpenMorningHour || "00"}:${
            obj.OpenMorningMinutes || "00"
          } am - ${obj.CloseMorningHour || "00"}:${
            obj.CloseMorningMinutes || "00"
          } pm`;
          let OpenAfternoon = `${obj.OpenAfternoonHour || "00"}:${
            obj.OpenAfternoonMinutes || "00"
          } pm - ${obj.CloseAfternoonHour || "00"}:${
            obj.CloseAfternoonMinutes || "00"
          } pm`;
          let IsVisible = obj.IsVisible == true ? "Mở" : "Đóng";

          let LastModificationTime = obj.LastModificationTime
            ? obj.LastModificationTime
            : obj.CreationTime;

          let count = await PostReport.count({
            where: { PostId: obj.dataValues.Id, Category: 2 },
          });
          let count2 = await PhotographerServicePackage.count({
            where: { PhotographerPostId: obj.dataValues.Id },
          });
          return {
            ...obj.dataValues,
            Id: `PTG-${("0000000000" + obj.dataValues.Id).slice(-10)}`,
            TotalReports: count,
            TotalServices: count2,
            OpenMorning,
            OpenAfternoon,
            IsVisible,
            LastModificationTime,
            TenantId: `PAR-${("0000000000" + obj.TenantId).slice(-10)}`,
          };
        })
      );
      // res.status(200).json({data})
      downloadPostExcel(data, res);
      // });
    }
    case "3": {
      data = await StudioPost.findAll({
        where: options,
        attributes: [
          "Id",
          "Name",
          "Address",
          "BookingCount",
          "CreationTime",
          "LastModificationTime",
          "IsVisible",
          "Note",
          "TotalRate",
          "TenantId",
          "OpenMorningHour",
          "OpenAfternoonHour",
          "OpenMorningMinutes",
          "OpenAfternoonMinutes",
          "CloseMorningHour",
          "CloseMorningMinutes",
          "CloseAfternoonHour",
          "CloseAfternoonMinutes",
        ],
      });
      data = await Promise.all(
        data.map(async (obj) => {
          let OpenMorning = `${obj.OpenMorningHour || "00"}:${
            obj.OpenMorningMinutes || "00"
          } am - ${obj.CloseMorningHour || "00"}:${
            obj.CloseMorningMinutes || "00"
          } pm`;
          let OpenAfternoon = `${obj.OpenAfternoonHour || "00"}:${
            obj.OpenAfternoonMinutes || "00"
          } pm - ${obj.CloseAfternoonHour || "00"}:${
            obj.CloseAfternoonMinutes || "00"
          } pm`;
          let IsVisible = obj.IsVisible == true ? "Mở" : "Đóng";
          let LastModificationTime = obj.LastModificationTime
            ? obj.LastModificationTime
            : obj.CreationTime;
          let count = await PostReport.count({
            where: { PostId: obj.dataValues.Id, Category: 1 },
          });

          let count2 = await StudioRoom.count({
            where: { StudioPostId: obj.dataValues.Id },
          });
          return {
            ...obj.dataValues,
            Id: `STD-${("0000000000" + obj.dataValues.Id).slice(-10)}`,
            TotalReports: count || 0,
            TotalServices: count2 || 0,
            LastModificationTime,
            OpenMorning,
            OpenAfternoon,
            IsVisible,
            TenantId: `PAR-${("0000000000" + obj.TenantId).slice(-10)}`,
          };
        })
      );

      downloadPostExcel(data, res);
      // });
    }
    case "5": {
      data = await StudioBooking.findAll({
        where: options,
        include: [
          { model: StudioRoom, where: { ...orderOption } },
          { model: SaleCode },
        ],
        order: [["CreationTime", "DESC"]],
      });

      data = data.map((item) => {
        let bookingStatus;
        let refundValue = 0;
        let totalSaleValue = 0;
        let feeCancelDate = 0;
        let PromoCodeId = "";

        let startDay = item.dataValues.OrderByDateFrom
          ? item.dataValues.OrderByDateFrom
          : moment(item.dataValues.OrderByTimeFrom)
              .utc()
              .format("DD/MM/YYY HH:mm");
        let endDay = item.dataValues.OrderByDateTo
          ? item.dataValues.OrderByDateTo
          : moment(item.dataValues.OrderByTimeTo)
              .utc()
              .format("DD/MM/YYY HH:mm");

        const CancelFreeDate = moment(
          item.dataValues?.OrderByTime
            ? item.dataValues?.OrderByTimeFrom
            : item.dataValues?.OrderByDateFrom
        )
          .subtract(
            item.dataValues?.OrderByTime
              ? item.dataValues?.FreeCancelByHour?.match(/\d+/g)[0]
              : item.dataValues?.FreeCancelByDate?.match(/\d+/g)[0],
            `${
              item.dataValues?.OrderByTime
                ? /ngày/.test(item.dataValues?.FreeCancelByHour)
                  ? "days"
                  : "hours"
                : /ngày/.test(item.dataValues?.FreeCancelByDate)
                ? "days"
                : "hours"
            }`
          )
          .utc()
          .format("DD/MM/YYYY HH:mm A");
        // console.log(CancelFreeDate);
        if (item.dataValues.SaleCode) {
          PromoCodeId = item.dataValues.SaleCode.SaleCode;
          if (item.dataValues.SaleCode.TypeReduce == 2) {
            totalSaleValue =
              (item.dataValues.BookingValueBeforeDiscount *
                item.dataValues.SaleCode.ReduceValue) /
                100 >=
              item.dataValues.SaleCode.MaxReduce
                ? item.dataValues.SaleCode.MaxReduce
                : (item.dataValues.BookingValueBeforeDiscount *
                    item.dataValues.SaleCode.ReduceValue) /
                  100;
          } else if (item.dataValues.SaleCode.TypeReduce == 1) {
            totalSaleValue = item.dataValues.SaleCode.ReduceValue;
          }
        }

        if (
          item.dataValues.BookingStatus == 1 &&
          [3, 4, 2].includes(item.dataValues.PaymentStatus)
        ) {
          bookingStatus = "Đã hoàn tất";
          refundValue = 0;
        }
        if (
          item.dataValues.BookingStatus == 3 &&
          [3, 4, 2, 1].includes(item.dataValues.PaymentStatus)
        ) {
          bookingStatus = "Vắng mặt";
          feeCancelDate = item.dataValues.OrderByTime
            ? ((item.dataValues.AbsentPriceByHour || 100) *
                item.dataValues.DepositValue) /
              100
            : ((item.dataValues.AbsentPriceByDate || 100) *
                item.dataValues.DepositValue) /
              100;
          refundValue = 0;
        }
        if (
          item.dataValues.BookingStatus == 4 &&
          [4, 3, 2].includes(item.dataValues.PaymentStatus)
        ) {
          bookingStatus = "Sắp tới";
          refundValue = 0;
        }
        if (item.dataValues.BookingStatus == 2) {
          bookingStatus = "Đã Huỷ";
          if (item.dataValues.DeletedNote == "Quá hạn thanh toán") {
            refundValue = 0;
          } else {
            refundValue =
              item.dataValues.DepositValue - item.dataValues.CancelPrice;
          }
        }
        if (
          item.dataValues.BookingStatus == 4 &&
          item.dataValues.PaymentStatus == 1
        ) {
          bookingStatus = "chờ thanh toán";
          refundValue = 0;
        }
        return {
          ...item.dataValues,
          Name: item.dataValues.StudioRoom.Name,

          OrderByDateFrom: startDay,
          OrderByDateTo: endDay,

          studioPostId: `STD-${(
            "0000000000" + item.dataValues.StudioRoom.StudioPostId
          ).slice(-10)}`,
          bookingStatus,
          refundValue,
          IdentifierCodeUser: `CUS-${(
            "0000000000" + item.dataValues.BookingUserId
          ).slice(-10)}`,
          totalSaleValue,
          CancelFreeDate,
          PromoCodeId,
          feeCancelDate,
          bankAccount: `${item.dataValues.bankAccount} - ${item.dataValues.accountUser}-${item.dataValues.bank}`,
          DeletionTime:
            item.dataValues.DeletionTime &&
            moment(item.dataValues.DeletionTime).format("DD/MM/YYYY HH:mm A "),
          percentCancel: item.dataValues.OrderByTime
            ? item.dataValues.CancelPriceByHour
            : item.dataValues.CancelPriceByDate,
          paymentStatus: handlerPaymentStatus(item.dataValues.PaymentStatus),
        };
      });
      // res.status(200).json(data);
      downloadOrderExcel(data, res);
      return;
    }
    case "6": {
      data = await StudioBooking.findAll({
        where: { ...options },
        attributes: [
          "id",
          "TenantId",
          "OrderByTime",
          "OrderByTimeFrom",
          "OrderByTimeTo",
          "OrderByDateFrom",
          "OrderByDateTo",
          "PromoCodeId",
          "PromoCodePartnerId",
          "CreationTime",
          "DeletionTime",
          "BookingStatus",
          "BookingValue",
          "PaymentStatus",
          "DepositValue",
          "CancelPrice",
          "BookingValueBeforeDiscount",
          "BookingUserName",
          "IdentifyCode",
          "AbsentPriceByDate",
          "AbsentPriceByHour",
        ],
        include: [
          // { model: StudioRoom },
          {
            model: RegisterPartner,
            attributes: ["PartnerName", "id", "CommissionRate"],
          },
          { model: SaleCode },
        ],
        order: [["CreationTime", "DESC"]],
      });
      data = data
        .map((item) => {
          let PromoCodeId = "";
          let startDay = item.dataValues.OrderByDateFrom
            ? item.dataValues.OrderByDateFrom
            : item.dataValues.OrderByTimeFrom;
          let actualDate = "",
            temporaryCommissionFee = 0;
          let bookingStatus;
          let SpendingPartnerPrice = 0,
            SpendingBookingStudioPrice = 0,
            SpendingPartner = 0,
            SpendingBookingStudio = 0,
            totalSaleValue = 0,
            refundValue = 0,
            temporaryCommissionFeeBeforeSale = 0,
            totalCommission = 0;

          let CommissionRate =
            item?.dataValues?.RegisterPartner?.CommissionRate || 0;
          if (item.dataValues.SaleCode !== null) {
            SpendingPartner = item.dataValues.SaleCode.SpendingPartner;
            SpendingBookingStudio =
              item.dataValues.SaleCode.SpendingBookingStudio;
            PromoCodeId = item.dataValues.SaleCode.SaleCode;
            if (item.dataValues.SaleCode.TypeReduce == 2) {
              totalSaleValue =
                (item.dataValues.BookingValueBeforeDiscount *
                  item.dataValues.SaleCode.ReduceValue) /
                  100 >=
                item.dataValues.SaleCode.MaxReduce
                  ? item.dataValues.SaleCode.MaxReduce
                  : (item.dataValues.BookingValueBeforeDiscount *
                      item.dataValues.SaleCode.ReduceValue) /
                    100;
              SpendingPartnerPrice =
                (totalSaleValue * item.dataValues.SaleCode.SpendingPartner) /
                100;
              SpendingBookingStudioPrice =
                totalSaleValue - SpendingPartnerPrice;
            } else if (item.dataValues.SaleCode.TypeReduce == 1) {
              totalSaleValue = item.dataValues.SaleCode.ReduceValue;
              SpendingPartnerPrice =
                (totalSaleValue * item.dataValues.SaleCode.SpendingPartner) /
                100;
              SpendingBookingStudioPrice =
                totalSaleValue - SpendingPartnerPrice;
            }
          }
          if (
            item.dataValues.BookingStatus == 1 &&
            [3, 4, 2].includes(Number(item.dataValues.PaymentStatus))
          ) {
            actualDate = item.dataValues.OrderByTime
              ? moment(item.dataValues.OrderByTimeTo)
                  .utc()
                  .format("DD/MM/YYYY HH:mm")
              : moment(item.dataValues.OrderByDateTo)
                  .utc()
                  .format("DD/MM/YYYY");
            temporaryCommissionFee =
              item.dataValues.BookingValueBeforeDiscount || 0;
            refundValue = 0;
            temporaryCommissionFeeBeforeSale =
              temporaryCommissionFee + refundValue;
            totalCommission =
              temporaryCommissionFeeBeforeSale - SpendingPartnerPrice;
            priceCommissionLasted = (totalCommission * CommissionRate) / 100;
            bookingStatus = "Đã hoàn tất";

            return {
              ...item.dataValues,
              actualDate,
              bookingStatus,
              totalSaleValue,
              SpendingPartnerPrice,
              SpendingBookingStudioPrice,
              PartnerName: item?.RegisterPartner?.PartnerName,
              TenantId: `PAR-${("0000000000" + item.dataValues.TenantId).slice(
                -10
              )}`,
              temporaryCommissionFee,
              refundValue,
              temporaryCommissionFeeBeforeSale,
              SpendingBookingStudio,
              SpendingPartner,
              totalCommission,
              CommissionRate,
              priceCommissionLasted,
              PromoCodeId,
            };
          }
          if (
            item.dataValues.BookingStatus == 3 &&
            [4, 3, 2, 1].includes(Number(item.dataValues.PaymentStatus))
          ) {
            bookingStatus = "Vắng mặt";
            actualDate = item.dataValues.OrderByTime
              ? moment(item.dataValues.OrderByTimeTo)
                  .utc()
                  .format("DD/MM/YYYY HH:mm")
              : moment(item.dataValues.OrderByDateTo)
                  .utc()
                  .format("DD/MM/YYYY");
            temporaryCommissionFee = item.dataValues.DepositValue || 0;
            let absentPercent =
              (item.dataValues.OrderByTime
                ? item.dataValues.AbsentPriceByHour
                : item.dataValues.AbsentPriceByDate) || 100;
            refundValue =
              ((100 - absentPercent) / 100) * item.dataValues.DepositValue;
            temporaryCommissionFeeBeforeSale =
              temporaryCommissionFee - refundValue;
            totalCommission = temporaryCommissionFeeBeforeSale;
            priceCommissionLasted = (totalCommission * CommissionRate) / 100;

            return {
              ...item.dataValues,
              actualDate,
              bookingStatus,
              totalSaleValue,
              SpendingPartnerPrice,
              SpendingBookingStudioPrice,
              PartnerName: item?.RegisterPartner?.PartnerName,
              TenantId: `PAR-${("0000000000" + item.dataValues.TenantId).slice(
                -10
              )}`,
              temporaryCommissionFee,
              refundValue,
              temporaryCommissionFeeBeforeSale,
              SpendingBookingStudio,
              SpendingPartner,
              totalCommission,
              CommissionRate,
              priceCommissionLasted,
              PromoCodeId,
            };
          }
          if (
            item.dataValues.BookingStatus == 2 &&
            [4, 3, 2].includes(Number(item.dataValues.PaymentStatus))
          ) {
            // CancelFreeDate = moment(
            //   item.dataValues.OrderByTime
            //     ? item.dataValues.OrderByTimeFrom
            //     : item.dataValues.OrderByDateFrom
            // )
            //   .subtract(
            //     item.dataValues?.OrderByTime
            //       ? item.dataValues?.FreeCancelByHour?.match(/\d+/g)[0]
            //       : item.dataValues?.FreeCancelByDate?.match(/\d+/g)[0],
            //     `${item.dataValues?.OrderByTime ? "hours" : "days"}`
            //   )
            //   .utc()
            //   .format();
            // check = moment() <= CancelFreeDate;
            // let CancelPrice;
            // if (check) {
            //   CancelPrice = 0;
            // } else {
            //   CancelPrice = item.dataValues.CancelPrice;
            // }
            actualDate = moment(item.dataValues.DeletionTime)
              .utc()
              .format("DD/MM/YYYY HH:mm");
            temporaryCommissionFee = item.dataValues.DepositValue || 0;
            refundValue =
              item.dataValues.DepositValue - item.dataValues.CancelPrice;
            temporaryCommissionFeeBeforeSale =
              temporaryCommissionFee - refundValue;
            totalCommission = temporaryCommissionFeeBeforeSale;
            priceCommissionLasted = (totalCommission * CommissionRate) / 100;
            bookingStatus = "Đã Huỷ";

            return {
              ...item.dataValues,
              actualDate,
              bookingStatus,
              totalSaleValue,
              SpendingPartnerPrice,
              SpendingBookingStudioPrice,
              PartnerName: item?.RegisterPartner?.PartnerName,
              TenantId: `PAR-${("0000000000" + item.dataValues.TenantId).slice(
                -10
              )}`,
              temporaryCommissionFee,
              refundValue,
              temporaryCommissionFeeBeforeSale,
              SpendingBookingStudio,
              SpendingPartner,
              totalCommission,
              CommissionRate,
              priceCommissionLasted,
              PromoCodeId,
            };
          }

          // if (
          //   item.dataValues.BookingStatus == 4 &&
          //   item.dataValues.PaymentStatus == 1
          // ) {
          //   bookingStatus = "chờ thanh toán";
          // }
        })
        .filter((item) => item != null);
      // res.status(200).json(data);
      downloadCommissionExcel(data, res);
      // res.status(200).json({ data });
    }
    default:
      break;
  }
});

exports.advanceFilter = catchAsync(async (req, res) => {
  const {
    keyString,
    category,
    location,
    priceOption,
    ratingOption,
    priceRange = [],
  } = req.body;
  const { page, limit } = req.query;
  let List, service;
  let tenantsIds = [];

  let groupIds = await WordKey.findAll({
    attributes: ["WordGroupId"],
    where: {
      Name: {
        [Op.like]: keyString ? `%${keyString}%` : "%%",
      },
    },
    raw: true,
  });
  groupIds = groupIds.map((term) => term.WordGroupId);

  let searchTerms = await WordKey.findAll({
    where: {
      WordGroupId: groupIds,
    },
    raw: true,
  });
  searchTerms = searchTerms.map((val) => val.Name);

  let condition = {
    where: {
      IsDeleted: false,
      IsVisible: true,
      [Op.or]: [
        {
          Name: {
            [Op.or]:
              searchTerms.length !== 0
                ? searchTerms.map((term) => ({
                    [Op.like]: keyString ? `%${term}%` : "%%",
                  }))
                : {
                    [Op.like]: keyString ? `%${keyString}%` : "%%",
                  },
          },
        },
        {
          Description: {
            [Op.like]: keyString ? `%${keyString}%` : "%%",
          },
        },
        {
          KeyWord: {
            [Op.like]: keyString ? `%${keyString}%` : "%%",
          },
        },
        {
          KeyWordDescription: {
            [Op.like]: keyString ? `%${keyString}%` : "%%",
          },
        },
      ],
    },
    order: [
      [
        sequelize.where(
          sequelize.col("Name"),
          "LIKE",
          `%${keyString ? keyString : ""}%`
        ),
        "DESC",
      ],
      [
        sequelize.where(
          sequelize.col("Description"),
          "LIKE",
          `%${keyString ? keyString : ""}%`
        ),
        "DESC",
      ],
      [
        sequelize.where(
          sequelize.col("KeyWord"),
          "LIKE",
          `%${keyString ? keyString : ""}%`
        ),
        "DESC",
      ],
      [
        sequelize.where(
          sequelize.col("KeyWordDescription"),
          "LIKE",
          `%${keyString ? keyString : ""}%`
        ),
        "DESC",
      ],
    ],
  };

  if (location !== "" && location !== undefined) {
    condition = {
      ...condition,
      where: {
        ...condition.where,
        Address: {
          [Op.like]: location ? `%${location}%` : "%%",
        },
      },
    };
  }

  // switch (priceOption) {
  //   case 1:
  //     condition = {
  //       ...condition,
  //       order: [
  //         ...condition.order,
  //         [sequelize.literal("PriceByDate"), "ASC"],
  //         [sequelize.literal("PriceByHour"), "ASC"],
  //       ],
  //     };
  //     break;
  //   case 2:
  //     condition = {
  //       ...condition,
  //       order: [
  //         ...condition.order,
  //         [sequelize.literal("PriceByDate"), "DESC"],
  //         [sequelize.literal("PriceByHour"), "DESC"],
  //       ],
  //     };
  //     break;
  //   case 3:
  //     condition = {
  //       ...condition,
  //       order: [
  //         [sequelize.literal("PercentDiscountByDate"), "DESC"],
  //         [sequelize.literal("PercentDiscountByHour"), "DESC"],
  //       ],
  //     };
  //     break;
  //   default:
  //     break;
  // }

  switch (ratingOption) {
    case 1:
      condition = {
        ...condition,
        order: [...condition.order, ["NumberOfRating", "DESC"]],
      };
      break;
    case 2:
      condition = {
        ...condition,
        order: [...condition.order, ["TotalRate", "DESC"]],
      };
      break;
    case 3:
      condition = {
        ...condition,
        order: [...condition.order, ["BookingCount", "DESC"]],
      };
      break;
    default:
      break;
  }

  if (category === undefined || category === "" || category === null) {
    const totalStudioPage = Math.ceil(
      (await StudioPost.count({
        where: {
          ...condition?.where,
          [Op.and]: [
            {
              [Op.or]: [
                sequelize.literal(
                  "(SELECT MIN(`StudioRooms`.`PriceByDate`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`StudioRooms`.`PriceByDate` BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ") IS NOT NULL"
                ),
                sequelize.literal(
                  "(SELECT MIN(`StudioRooms`.`PriceByHour`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`StudioRooms`.`PriceByHour` BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ") IS NOT NULL"
                ),
              ],
            },
            { [Op.or]: condition.where[Op.or] },
          ],
        },
      })) / +limit
    );
    const totalPhotographerPage = Math.ceil(
      (await PhotographerPost.count({
        where: condition.where,
      })) / +limit
    );

    if (page <= totalStudioPage) {
      const studioList = await baseController.Pagination(
        StudioPost,
        page,
        limit,
        {
          attributes: {
            include: [
              [
                sequelize.literal(
                  "(SELECT MIN(`StudioRooms`.`PriceByDate`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`StudioRooms`.`PriceByDate` BETWEEN " +
                          "100" +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ")"
                ),
                "PriceByDate",
              ],
              [
                sequelize.literal(
                  "(SELECT MIN(`StudioRooms`.`PriceByHour`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`StudioRooms`.`PriceByHour` BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ")"
                ),
                "PriceByHour",
              ],
              [
                sequelize.literal(
                  "(SELECT MAX(PercentDiscountTable.PercentDiscount) FROM (SELECT ((1-(SalePriceByHour/PriceByHour))*100) AS PercentDiscount FROM StudioRooms WHERE StudioRooms.StudioPostId = StudioPost.Id " +
                    `${
                      priceRange?.length > 0
                        ? "AND (StudioRooms.PriceByHour BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    "GROUP BY PriceByHour, SalePriceByHour) AS PercentDiscountTable )"
                ),
                "PercentDiscountByHour",
              ],
              [
                sequelize.literal(
                  "(SELECT MAX(PercentDiscountTable.PercentDiscount) FROM (SELECT ((1-(SalePriceByDate/PriceByDate))*100) AS PercentDiscount FROM StudioRooms WHERE StudioRooms.StudioPostId = StudioPost.Id " +
                    `${
                      priceRange?.length > 0
                        ? "AND (StudioRooms.PriceByDate BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    "GROUP BY PriceByDate, SalePriceByDate) AS PercentDiscountTable )"
                ),
                "PercentDiscountByDate",
              ],
            ],
          },
          where: {
            ...condition?.where,
            [Op.and]: [
              {
                [Op.or]: [
                  // ...condition?.where[Op.or],
                  sequelize.literal(
                    "(SELECT MIN(`StudioRooms`.`PriceByDate`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                      `${
                        priceRange?.length > 0
                          ? "AND (`StudioRooms`.`PriceByDate` BETWEEN " +
                            priceRange[0] +
                            " AND " +
                            priceRange[1] +
                            ")"
                          : ""
                      }` +
                      ") IS NOT NULL"
                  ),
                  sequelize.literal(
                    "(SELECT MIN(`StudioRooms`.`PriceByHour`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                      `${
                        priceRange?.length > 0
                          ? "AND (`StudioRooms`.`PriceByHour` BETWEEN " +
                            priceRange[0] +
                            " AND " +
                            priceRange[1] +
                            ")"
                          : ""
                      }` +
                      ") IS NOT NULL"
                  ),
                ],
              },
              { [Op.or]: condition.where[Op.or] },
            ],
          },
          order: condition?.order,
        },
        [
          {
            model: StudioPost_User,
            as: "UsersLiked",
            attributes: ["UserId"],
          },
        ]
      );
      List = {
        ...studioList,
        data: ImageListDestructure(
          studioList.data.map((val) => ({
            ...val.dataValues,
            IdentifierCode: `STD-${Math.floor(val.CreationTime)}`,
            category: 1,
          }))
        ),
      };
    } else if (
      page > totalPhotographerPage &&
      page <= totalStudioPage + totalPhotographerPage
    ) {
      const photographerList = await baseController.Pagination(
        PhotographerPost,
        page - totalStudioPage,
        limit,
        {
          attributes: {
            include: [
              [
                sequelize.literal(
                  "(SELECT MIN(`PhotographerServicePackages`.`PriceByDate`) FROM `PhotographerServicePackages` WHERE `PhotographerServicePackages`.`PhotographerPostId` = `PhotographerPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`PhotographerServicePackages`.`PriceByDate` BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ")"
                ),
                "PriceByDate",
              ],
              [
                sequelize.literal(
                  "(SELECT MIN(`PhotographerServicePackages`.`PriceByHour`) FROM `PhotographerServicePackages` WHERE `PhotographerServicePackages`.`PhotographerPostId` = `PhotographerPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`PhotographerServicePackages`.`PriceByHour` BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ")"
                ),
                "PriceByHour",
              ],
            ],
          },
          where: condition?.where,
          order: condition?.order,
        },
        [
          {
            model: PhotographerPost_User,
            as: "UsersLiked",
            attributes: ["UserId"],
          },
        ]
      );
      List = {
        ...photographerList,
        data: ImageListDestructure(
          photographerList.data.map((val) => ({
            ...val.dataValues,
            // IdentifierCode: `STD-${Math.floor(val.CreationTime)}`,
            category: 2,
          }))
        ),
      };
    }

    return res.json({
      ...List,
      pagination: {
        ...List?.pagination,
        totalPages: totalStudioPage + totalPhotographerPage,
        currentPage: +page,
      },
    });
  }

  switch (category) {
    case 1:
      List = await baseController.Pagination(
        StudioPost,
        page,
        limit,
        {
          attributes: {
            include: [
              [
                sequelize.literal(
                  "(SELECT MIN(`StudioRooms`.`PriceByDate`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`StudioRooms`.`PriceByDate` BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ")"
                ),
                "PriceByDate",
              ],
              [
                sequelize.literal(
                  "(SELECT MIN(`StudioRooms`.`PriceByHour`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`StudioRooms`.`PriceByHour` BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ")"
                ),
                "PriceByHour",
              ],
              [
                sequelize.literal(
                  "(SELECT MAX(PercentDiscountTable.PercentDiscount) FROM (SELECT ((1-(SalePriceByHour/PriceByHour))*100) AS PercentDiscount FROM StudioRooms WHERE StudioRooms.StudioPostId = StudioPost.Id " +
                    `${
                      priceRange?.length > 0
                        ? "AND (StudioRooms.PriceByHour BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    "GROUP BY PriceByHour, SalePriceByHour) AS PercentDiscountTable )"
                ),
                "PercentDiscountByHour",
              ],
              [
                sequelize.literal(
                  "(SELECT MAX(PercentDiscountTable.PercentDiscount) FROM (SELECT ((1-(SalePriceByDate/PriceByDate))*100) AS PercentDiscount FROM StudioRooms WHERE StudioRooms.StudioPostId = StudioPost.Id " +
                    `${
                      priceRange?.length > 0
                        ? "AND (StudioRooms.PriceByDate BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    "GROUP BY PriceByDate, SalePriceByDate) AS PercentDiscountTable )"
                ),
                "PercentDiscountByDate",
              ],
            ],
          },
          where: {
            ...condition?.where,
            [Op.and]: [
              {
                [Op.or]: [
                  // ...condition?.where[Op.or],
                  sequelize.literal(
                    "(SELECT MIN(`StudioRooms`.`PriceByDate`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                      `${
                        priceRange?.length > 0
                          ? "AND (`StudioRooms`.`PriceByDate` BETWEEN " +
                            priceRange[0] +
                            " AND " +
                            priceRange[1] +
                            ")"
                          : ""
                      }` +
                      ") IS NOT NULL"
                  ),
                  sequelize.literal(
                    "(SELECT MIN(`StudioRooms`.`PriceByHour`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                      `${
                        priceRange?.length > 0
                          ? "AND (`StudioRooms`.`PriceByHour` BETWEEN " +
                            priceRange[0] +
                            " AND " +
                            priceRange[1] +
                            ")"
                          : ""
                      }` +
                      ") IS NOT NULL"
                  ),
                ],
              },
              { [Op.or]: condition.where[Op.or] },
            ],
          },
          order: condition?.order,
        },
        [
          {
            model: StudioPost_User,
            as: "UsersLiked",
            attributes: ["UserId"],
          },
        ]
      );

      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            IdentifierCode: `STD-${Math.floor(val.CreationTime)}`,
            category: 1,
          }))
        ),
      };
      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      break;
    case 2:
      List = await baseController.Pagination(
        PhotographerPost,
        page,
        limit,
        {
          attributes: {
            include: [
              [
                sequelize.literal(
                  "(SELECT MIN(`PhotographerServicePackages`.`PriceByDate`) FROM `PhotographerServicePackages` WHERE `PhotographerServicePackages`.`PhotographerPostId` = `PhotographerPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`PhotographerServicePackages`.`PriceByDate` BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ")"
                ),
                "PriceByDate",
              ],
              [
                sequelize.literal(
                  "(SELECT MIN(`PhotographerServicePackages`.`PriceByHour`) FROM `PhotographerServicePackages` WHERE `PhotographerServicePackages`.`PhotographerPostId` = `PhotographerPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`PhotographerServicePackages`.`PriceByHour` BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ")"
                ),
                "PriceByHour",
              ],
            ],
          },
          where: {
            ...condition?.where,
            [Op.and]: [
              {
                [Op.or]: [
                  sequelize.literal(
                    "(SELECT MIN(`PhotographerServicePackages`.`PriceByDate`) FROM `PhotographerServicePackages` WHERE `PhotographerServicePackages`.`PhotographerPostId` = `PhotographerPost`.`Id` " +
                      `${
                        priceRange?.length > 0
                          ? "AND (`PhotographerServicePackages`.`PriceByDate` BETWEEN " +
                            priceRange[0] +
                            " AND " +
                            priceRange[1] +
                            ")"
                          : ""
                      }` +
                      ") IS NOT NULL"
                  ),
                  sequelize.literal(
                    "(SELECT MIN(`PhotographerServicePackages`.`PriceByHour`) FROM `PhotographerServicePackages` WHERE `PhotographerServicePackages`.`PhotographerPostId` = `PhotographerPost`.`Id` " +
                      `${
                        priceRange?.length > 0
                          ? "AND (`PhotographerServicePackages`.`PriceByHour` BETWEEN " +
                            priceRange[0] +
                            " AND " +
                            priceRange[1] +
                            ")"
                          : ""
                      }` +
                      ") IS NOT NULL"
                  ),
                ],
              },
              { [Op.or]: condition.where[Op.or] },
            ],
          },
          order: condition?.order,
        },
        [
          {
            model: PhotographerPost_User,
            as: "UsersLiked",
            attributes: ["UserId"],
          },
        ]
      );
      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            IdentifierCode: `PTG-${Math.floor(val.CreationTime)}`,
            category: 2,
          }))
        ),
      };

      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      break;
    case 3:
      List = await baseController.Pagination(
        ClothesPost,
        page,
        limit,
        condition,
        {
          model: ClothesPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        }
      );

      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            IdentifierCode: `CLT-${Math.floor(val.CreationTime)}`,
            category: 3,
          }))
        ),
      };

      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      break;
    case 4:
      List = await baseController.Pagination(
        MakeupPost,
        page,
        limit,
        condition,
        {
          model: MakeupPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        }
      );
      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            IdentifierCode: `MKP-${Math.floor(val.CreationTime)}`,
            category: 4,
          }))
        ),
      };

      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      createWebHookSendAttempts();
      break;
    case 5:
      List = await baseController.Pagination(
        DevicePost,
        page,
        limit,
        condition,
        {
          model: DevicePost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        }
      );
      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            IdentifierCode: `DVC-${Math.floor(val.CreationTime)}`,
            category: 5,
          }))
        ),
      };

      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      break;
    case 6:
      List = await baseController.Pagination(
        ModelPost,
        page,
        limit,
        condition,
        {
          model: ModelPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        }
      );
      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            IdentifierCode: `MDL-${Math.floor(val.CreationTime)}`,
            category: 6,
          }))
        ),
      };

      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      break;
    default:
      break;
  }

  res.json(List);
});

exports.advanceFilterMobile = catchAsync(async (req, res) => {
  let {
    keyString,
    category = [1, 2, 3, 4, 5, 6],
    provinces = [],
    priceOption,
    priceRange = [],
    districts = [],
  } = req.body;
  if (category.length === 0 || category === undefined) {
    category = [1, 2, 3, 4, 5, 6];
  } else {
    category = category.map((cate) => Number(cate));
  }

  const { page, limit } = req.query;

  let groupIds = await WordKey.findAll({
    attributes: ["WordGroupId"],
    where: {
      Name: {
        [Op.like]: keyString ? `%${keyString}%` : "%%",
      },
    },
    raw: true,
  });
  groupIds = groupIds.map((term) => term.WordGroupId);

  let searchTerms = await WordKey.findAll({
    where: {
      WordGroupId: groupIds,
    },
    raw: true,
  });
  searchTerms = searchTerms.map((val) => val.Name);
  let condition = {
    where: {
      IsDeleted: false,
      IsVisible: true,
      [Op.or]: [
        {
          Name: {
            [Op.or]:
              searchTerms.length !== 0
                ? searchTerms.map((term) => ({
                    [Op.like]: keyString ? `%${term}%` : "%%",
                  }))
                : {
                    [Op.like]: keyString ? `%${keyString}%` : "%%",
                  },
          },
        },
        {
          Description: {
            [Op.like]: keyString ? `%${keyString}%` : "%%",
          },
        },
        {
          KeyWord: {
            [Op.like]: keyString ? `%${keyString}%` : "%%",
          },
        },
        {
          KeyWordDescription: {
            [Op.like]: keyString ? `%${keyString}%` : "%%",
          },
        },
      ],
      Address: {
        [Op.or]: [
          ...(typeof provinces === "string" ? [provinces] : provinces),
          ...districts,
        ].map((item) => ({
          [Op.substring]: item,
        })),
      },
    },
    order: [
      [
        sequelize.where(
          sequelize.col("Name"),
          "LIKE",
          `%${keyString ? keyString : ""}%`
        ),
        "DESC",
      ],
      [
        sequelize.where(
          sequelize.col("Description"),
          "LIKE",
          `%${keyString ? keyString : ""}%`
        ),
        "DESC",
      ],
      [
        sequelize.where(
          sequelize.col("KeyWord"),
          "LIKE",
          `%${keyString ? keyString : ""}%`
        ),
        "DESC",
      ],
      [
        sequelize.where(
          sequelize.col("KeyWordDescription"),
          "LIKE",
          `%${keyString ? keyString : ""}%`
        ),
        "DESC",
      ],
    ],
  };

  switch (priceOption) {
    case 1:
      condition = {
        ...condition,
        order: [
          ...condition.order,
          [sequelize.literal("PriceByDate"), "ASC"],
          [sequelize.literal("PriceByHour"), "ASC"],
        ],
      };
      break;
    case 2:
      condition = {
        ...condition,
        order: [
          ...condition.order,
          [sequelize.literal("PriceByDate"), "DESC"],
          [sequelize.literal("PriceByHour"), "DESC"],
        ],
      };
      break;
    case 2:
      condition = {
        ...condition,
        order: [
          ...condition.order,
          [sequelize.literal("PercentDiscountByDate"), "DESC"],
          [sequelize.literal("PercentDiscountByHour"), "DESC"],
        ],
      };
      break;
    default:
      break;
  }

  let pagination = [];

  let totalStudioPage = 0,
    totalPhotographerPage = 0,
    totalClothesPage = 0,
    totalModelPage = 0,
    totalDevicePage = 0,
    totalMakeupPage = 0;
  await Promise.all(
    category.map(async (cate) => {
      switch (Number(cate)) {
        case 1:
          totalStudioPage = Math.ceil(
            (await StudioPost.count({
              where: {
                ...condition?.where,
                [Op.and]: [
                  {
                    [Op.or]: [
                      // ...condition?.where[Op.or],
                      sequelize.literal(
                        "(SELECT MIN(`StudioRooms`.`PriceByDate`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                          `${
                            priceRange?.length > 0
                              ? "AND (`StudioRooms`.`PriceByDate` BETWEEN " +
                                priceRange[0] +
                                " AND " +
                                priceRange[1] +
                                ")"
                              : ""
                          }` +
                          ") IS NOT NULL"
                      ),
                      sequelize.literal(
                        "(SELECT MIN(`StudioRooms`.`PriceByHour`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                          `${
                            priceRange?.length > 0
                              ? "AND (`StudioRooms`.`PriceByHour` BETWEEN " +
                                priceRange[0] +
                                " AND " +
                                priceRange[1] +
                                ")"
                              : ""
                          }` +
                          ") IS NOT NULL"
                      ),
                    ],
                  },
                  { [Op.or]: condition.where[Op.or] },
                ],
              },
            })) / +limit
          );
          break;
        case 2:
          totalPhotographerPage = Math.ceil(
            (await PhotographerPost.count({
              where: condition.where,
            })) / +limit
          );
          break;
        case 3:
          totalClothesPage = Math.ceil(
            (await ClothesPost.count({
              where: condition.where,
            })) / +limit
          );
          break;
        case 4:
          totalMakeupPage = Math.ceil(
            (await MakeupPost.count({
              where: condition.where,
            })) / +limit
          );
          break;
        case 5:
          totalDevicePage = Math.ceil(
            (await DevicePost.count({
              where: condition.where,
            })) / +limit
          );
          break;
        case 6:
          totalModelPage = Math.ceil(
            (await ModelPost.count({
              where: condition.where,
            })) / +limit
          );
          break;
        default:
          break;
      }
    })
  );
  let List = {};
  if (page <= totalStudioPage && category.includes(1)) {
    const studioList = await baseController.Pagination(
      StudioPost,
      page,
      limit,
      {
        attributes: {
          include: [
            [
              sequelize.literal(
                "(SELECT MIN(`StudioRooms`.`PriceByDate`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                  `${
                    priceRange?.length > 0
                      ? "AND (`StudioRooms`.`PriceByDate` BETWEEN " +
                        priceRange[0] +
                        " AND " +
                        priceRange[1] +
                        ")"
                      : ""
                  }` +
                  ")"
              ),
              "PriceByDate",
            ],
            [
              sequelize.literal(
                "(SELECT MIN(`StudioRooms`.`PriceByHour`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                  `${
                    priceRange?.length > 0
                      ? "AND (`StudioRooms`.`PriceByHour` BETWEEN " +
                        priceRange[0] +
                        " AND " +
                        priceRange[1] +
                        ")"
                      : ""
                  }` +
                  ")"
              ),
              "PriceByHour",
            ],
            [
              sequelize.literal(
                "(SELECT MAX(PercentDiscountTable.PercentDiscount) FROM (SELECT ((1-(SalePriceByHour/PriceByHour))*100) AS PercentDiscount FROM StudioRooms WHERE StudioRooms.StudioPostId = StudioPost.Id " +
                  `${
                    priceRange?.length > 0
                      ? "AND (StudioRooms.PriceByHour BETWEEN " +
                        priceRange[0] +
                        " AND " +
                        priceRange[1] +
                        ")"
                      : ""
                  }` +
                  "GROUP BY PriceByHour, SalePriceByHour) AS PercentDiscountTable )"
              ),
              "PercentDiscountByHour",
            ],
            [
              sequelize.literal(
                "(SELECT MAX(PercentDiscountTable.PercentDiscount) FROM (SELECT ((1-(SalePriceByDate/PriceByDate))*100) AS PercentDiscount FROM StudioRooms WHERE StudioRooms.StudioPostId = StudioPost.Id " +
                  `${
                    priceRange?.length > 0
                      ? "AND (StudioRooms.PriceByDate BETWEEN " +
                        priceRange[0] +
                        " AND " +
                        priceRange[1] +
                        ")"
                      : ""
                  }` +
                  "GROUP BY PriceByDate, SalePriceByDate) AS PercentDiscountTable )"
              ),
              "PercentDiscountByDate",
            ],
          ],
        },
        where: {
          ...condition?.where,
          [Op.and]: [
            {
              [Op.or]: [
                // ...condition?.where[Op.or],
                sequelize.literal(
                  "(SELECT MIN(`StudioRooms`.`PriceByDate`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`StudioRooms`.`PriceByDate` BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ") IS NOT NULL"
                ),
                sequelize.literal(
                  "(SELECT MIN(`StudioRooms`.`PriceByHour`) FROM `StudioRooms` WHERE `StudioRooms`.`StudioPostId` = `StudioPost`.`Id` " +
                    `${
                      priceRange?.length > 0
                        ? "AND (`StudioRooms`.`PriceByHour` BETWEEN " +
                          priceRange[0] +
                          " AND " +
                          priceRange[1] +
                          ")"
                        : ""
                    }` +
                    ") IS NOT NULL"
                ),
              ],
            },
            { [Op.or]: condition.where[Op.or] },
          ],
        },
        order: condition?.order,
      },
      [
        {
          model: StudioPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      ]
    );
    List = {
      ...studioList,
      data: ImageListDestructure(
        studioList.data.map((val) => ({
          ...val.dataValues,
          IdentifierCode: `STD-${Math.floor(val.CreationTime)}`,
          category: 1,
        }))
      ),
    };
  } else if (
    page > totalStudioPage &&
    page <= totalStudioPage + totalPhotographerPage &&
    category.includes(2)
  ) {
    const photographerList = await baseController.Pagination(
      PhotographerPost,
      page - totalStudioPage,
      limit,
      {
        attributes: {
          include: [
            [
              sequelize.literal(
                "(SELECT MIN(`PhotographerServicePackages`.`PriceByDate`) FROM `PhotographerServicePackages` WHERE `PhotographerServicePackages`.`PhotographerPostId` = `PhotographerPost`.`Id` " +
                  `${
                    priceRange?.length > 0
                      ? "AND (`PhotographerServicePackages`.`PriceByDate` BETWEEN " +
                        priceRange[0] +
                        " AND " +
                        priceRange[1] +
                        ")"
                      : ""
                  }` +
                  ")"
              ),
              "PriceByDate",
            ],
            [
              sequelize.literal(
                "(SELECT MIN(`PhotographerServicePackages`.`PriceByHour`) FROM `PhotographerServicePackages` WHERE `PhotographerServicePackages`.`PhotographerPostId` = `PhotographerPost`.`Id` " +
                  `${
                    priceRange?.length > 0
                      ? "AND (`PhotographerServicePackages`.`PriceByHour` BETWEEN " +
                        priceRange[0] +
                        " AND " +
                        priceRange[1] +
                        ")"
                      : ""
                  }` +
                  ")"
              ),
              "PriceByHour",
            ],
          ],
        },
        where: condition?.where,
        order: condition?.order,
      },
      [
        {
          model: PhotographerPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      ]
    );
    List = {
      ...photographerList,
      data: ImageListDestructure(
        photographerList.data.map((val) => ({
          ...val.dataValues,
          // IdentifierCode: `STD-${Math.floor(val.CreationTime)}`,
          category: 2,
        }))
      ),
    };
  }

  res.json(
    List
      ? {
          ...List,
          pagination: {
            ...List?.pagination,
            totalPages: totalStudioPage + totalPhotographerPage,
            currentPage: +page,
          },
        }
      : {}
  );
});
