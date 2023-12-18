const schedule = require("node-schedule");
const {
  StudioBooking,
  PhotographerBooking,
  BookingUser,
  StudioRoom,
  StudioPost,
  ClothesPost,
  MakeupPost,
  ModelPost,
  DevicePost,
  PhotographerPost,
  ClothesBooking,
  MakeUpBooking,
  DeviceBooking,
  ModelBooking,
  PhotographerServicePackage,
  MakeupServicePackage,
  ModelServicePackage,
  ClothesGroup,
  DeviceServicePackage,
  AppBinaryObject,
  RegisterPartner,
  SaleCode,
  PromoteCode_UserSave,
  AffiliateUser,
  ScheduleAndPriceStudioByDate,
  ScheduleAndPricePhotographerByDate,
  ScheduleAndPriceClothesByDate,
  ScheduleAndPriceMakeUpByDate,
  ScheduleAndPriceModelByDate,
  ScheduleAndPriceDeviceByDate,
  CartItem,
} = require("../models");
const catchAsync = require("../middlewares/async");
const moment = require("moment");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const baseController = require("../utils/BaseController");
const {
  createWebHookSendAttempts,
  createWebHookEvents,
} = require("./adminWebhook");
const AffiliateProduct = require("../models/AffiliateProduct");

exports.createBooking = catchAsync(async (req, res) => {
  /**
   * Arg:
   * req.body:
   *  ...
   *  Size, Amount, Color
   */
  let {
    CartItemId,
    PromoCodeId,
    OrderNote,
    BookingUserName,
    BookingPhone,
    BookingEmail,
    ProductId,
    ModelServiceId,
    PaymentType,
    CreatorUserId,
    IsPayDeposit,
    AffiliateUserId,
    BookingValue,
    BookingValueBeforeDiscount,
    numberOfTime,
  } = req.body;
  let cartItem;
  if (CartItemId) {
    console.log(CartItemId);
    cartItem = await CartItem.findByPk(CartItemId);
  } else {
    console.log("*******Qua rồi*****************");
  }
  let OrderByTime,
    OrderByTimeFrom,
    OrderByTimeTo,
    OrderByDateFrom,
    OrderByDateTo,
    RoomId,
    StudioPostId,
    Category;
  if (cartItem) {
    OrderByTime = cartItem?.dataValues?.OrderByTime;
    OrderByTimeFrom = cartItem?.dataValues?.OrderByTimeFrom;
    OrderByTimeTo = cartItem?.dataValues?.OrderByTimeTo;
    OrderByDateFrom = cartItem?.dataValues?.OrderByDateFrom;
    OrderByDateTo = cartItem?.dataValues?.OrderByDateTo;
    RoomId = cartItem?.dataValues?.RoomId;
    StudioPostId = cartItem?.dataValues?.StudioPostId;
    Category = cartItem?.dataValues?.Category;
  } else {
    OrderByTime = req?.body?.OrderByTime;
    OrderByTimeFrom = req?.body?.OrderByTimeFrom;
    OrderByTimeTo = req?.body?.OrderByTimeTo;
    OrderByDateFrom = req?.body?.OrderByDateFrom;
    OrderByDateTo = req?.body?.OrderByDateTo;
    RoomId = req?.body?.RoomId;
    StudioPostId = req?.body?.ProductId;
    Category = req?.body?.Category;
  }
  let BookingUserId = req?.user?.id;
  const BookingStatus = 4; //chờ thực hiện
  let IdentifyCode, TenantId, Product, Partner, Post, List;
  const checkAffiliateUserId = await AffiliateUser.findOne({
    where: { Id: AffiliateUserId },
  });
  let checkTimeExits, checkExpired;
  const conditionTime = OrderByTime
    ? {
        [Op.or]: {
          OrderByTimeFrom: {
            [Op.between]: [moment(OrderByTimeFrom), moment(OrderByTimeTo)],
          },
          OrderByTimeTo: {
            [Op.between]: [moment(OrderByTimeFrom), moment(OrderByTimeTo)],
          },
        },
      }
    : {
        [Op.or]: {
          OrderByDateFrom: {
            [Op.between]: [moment(OrderByDateFrom), moment(OrderByDateTo)],
          },
          OrderByDateTo: {
            [Op.between]: [moment(OrderByDateFrom), moment(OrderByDateTo)],
          },
        },
      };
  switch (+Category) {
    case 1:
      Product = await StudioRoom.findByPk(RoomId);
      TenantId = Product.dataValues.TenantId;
      Partner = await RegisterPartner.findOne({ where: { Id: TenantId } });
      Post = await StudioPost.findByPk(StudioPostId);

      IdentifyCode = await baseController.randomIdentifyCode(
        StudioBooking,
        "OSTD-"
      );

      checkTimeExits = await StudioBooking.findOne({
        where: { ...conditionTime, StudioRoomId: RoomId },
      });
      if (checkTimeExits) {
        throw new ApiError(500, "Đã có người đặt trong khoảng thời gian này!");
      }

      checkExpired = await StudioBooking.findOne({
        where: {
          ...(OrderByTime
            ? {
                [Op.or]: {
                  OrderByTimeFrom: {
                    [Op.lte]: moment(),
                    OrderByTimeTo: { [Op.lte]: moment() },
                  },
                },
              }
            : {
                [Op.or]: {
                  OrderByDateFrom: {
                    [Op.lte]: moment(),
                    OrderByDateTo: { [Op.lte]: moment() },
                  },
                },
              }),
        },
      });

      if (checkExpired) {
        throw new ApiError(500, "Thời gian đặt đã quá hạn!");
      }

      List = await StudioBooking.create({
        TenantId,
        IdentifyCode,
        OrderByTime,
        ...(OrderByTime
          ? {
              OrderByTimeFrom: moment(OrderByTimeFrom),
              OrderByTimeTo: moment(OrderByTimeTo),
            }
          : {
              OrderByDateFrom: moment(new Date(OrderByDateFrom))
                .add(Post?.dataValues?.HourOpenDefault, "h")
                .add(Post?.dataValues?.MinutesOpenDefault, "m"),
              OrderByDateTo: moment(new Date(OrderByDateTo))
                .add(Post?.dataValues?.HourCloseDefault, "h")
                .add(Post?.dataValues?.MinutesCloseDefault, "m"),
            }),
        PaymentTypeOnline: 1,
        PaymentStatus: 1,
        OrderNote,
        BookingUserName,
        BookingPhone,
        BookingEmail,
        BookingUserId,
        CreatorUserId: BookingUserId,
        BookingStatus,
        StudioRoomId: RoomId,
        IsPayDeposit: IsPayDeposit || 0, //default is 0, because customer can only pay the deposit after confirm the order
        IsDeleted: 0,
        BookingValue,
        BookingValueBeforeDiscount,
        CreationTime: moment(Date.now()),
        LastModificationTime: moment(Date.now()),
        IsRefund: 0,
        PromoCodeId: PromoCodeId || null,
        DepositValue: OrderByTime
          ? (BookingValue * Product.dataValues.DepositByHour) / 100
          : (BookingValue * Product.dataValues.DepositByDate) / 100,
        AffiliateUserId: checkAffiliateUserId ? AffiliateUserId : undefined,
        Category,
        numberOfTime,
        HasLamp: Product.HasLamp,
        LampDescription: Product.LampDescription,
        HasBackground: Product.HasBackground,
        BackgroundDescription: Product.BackgroundDescription,
        HasTable: Product.HasTable,
        HasChair: Product.HasChair,
        HasSofa: Product.HasSofa,
        HasFlower: Product.HasFlower,
        HasOtherDevice: Product.HasOtherDevice,
        OtherDeviceDescription: Product.OtherDeviceDescription,
        HasFan: Product.HasFan,
        HasAirConditioner: Product.HasAirConditioner,
        HasDressingRoom: Product.HasDressingRoom,
        HasWC: Product.HasWC,
        HasCamera: Product.HasCamera,
        HasWifi: Product.HasWifi,
        HasMotorBikeParking: Product.HasMotorBikeParking,
        HasCarParking: Product.HasCarParking,
        HasSupporter: Product.HasSupporter,
        Width: Product.Width,
        Length: Product.Length,
        Height: Product.Height,
        Area: Product.Area,
        MaximumCustomer: Product.MaximumCustomer,
        Surcharge: Product.Surcharge,
        CancelPriceByDate: Product.CancelPriceByDate,
        CancelPriceByHour: Product.CancelPriceByHour,
        AbsentPriceByDate: Product.AbsentPriceByDate,
        AbsentPriceByHour: Product.AbsentPriceByHour,
        DepositByDate: Product.DepositByDate,
        DepositByHour: Product.DepositByHour,
        FreeCancelByDate: Product.FreeCancelByDate,
        FreeCancelByHour: Product.FreeCancelByHour,
        AffiliateCommission: OrderByTime
          ? (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByHour || 0.05)
            ).toFixed(2)
          : (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByDate || 0.05)
            ).toFixed(2),
        CommissionPercent: OrderByTime
          ? Post.AffiliateCommissionByHour || 0.05
          : Post.AffiliateCommissionByDate || 0.05,
      });
      console.log("List: \n" + List);
      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      break;
    case 2:
      Product = await PhotographerServicePackage.findByPk(RoomId);
      TenantId = Product.dataValues.TenantId;
      Partner = await RegisterPartner.findOne({ where: { Id: TenantId } });
      Post = await PhotographerPost.findOne({ where: { TenantId } });
      IdentifyCode = await baseController.randomIdentifyCode(
        PhotographerBooking,
        "OPTG-"
      );
      List = await PhotographerBooking.create({
        TenantId,
        IdentifyCode,
        OrderByTime,
        OrderByTimeFrom: OrderByTimeFrom ? OrderByTimeFrom : null,
        OrderByTimeTo: OrderByTimeTo ? OrderByTimeTo : null,
        OrderByDateFrom: OrderByDateFrom ? OrderByDateFrom : null,
        OrderByDateTo: OrderByDateTo ? OrderByDateTo : null,
        PaymentTypeOnline: 1,
        PaymentStatus: 1,
        OrderNote,
        BookingUserName,
        BookingPhone,
        BookingEmail,
        BookingUserId,
        CreatorUserId,
        BookingStatus,
        PhotographerServicePackageId: RoomId,
        AffiliateCommission: OrderByTime
          ? (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByHour || 0.05)
            ).toFixed(2)
          : (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByDate || 0.05)
            ).toFixed(2),
        CommissionPercent: OrderByTime
          ? Post.AffiliateCommissionByHour || 0.05
          : Post.AffiliateCommissionByDate || 0.05,
        IsPayDeposit: IsPayDeposit || 0, //default is 0, because customer can only pay the deposit after confirm the order
        IsDeleted: 0,
        BookingValue,
        CreationTime: moment(Date.now()),
        LastModificationTime: moment(Date.now()),
        IsRefund: 0,
        PromoCodeId: PromoCodeId || null,
        BookingValueBeforeDiscount,
        DepositValue: OrderByTime
          ? (BookingValue * Product.DepositByHour) / 100
          : (BookingValue * Product.DepositByDate) / 100,
        AffiliateUserId: checkAffiliateUserId ? AffiliateUserId : undefined,
        Category,
        numberOfTime,
        CancelPriceByDate: Product.CancelPriceByDate,
        CancelPriceByHour: Product.CancelPriceByHour,
        DepositByDate: Product.DepositByDate,
        DepositByHour: Product.DepositByHour,
        FreeCancelByDate: Product.FreeCancelByDate,
        FreeCancelByHour: Product.FreeCancelByHour,
      });

      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      break;
    case 6:
      Product = await ModelServicePackage.findByPk(RoomId);
      TenantId = Product.dataValues.TenantId;
      Partner = await RegisterPartner.findOne({ where: { Id: TenantId } });
      Post = await ModelPost.findOne({ where: { TenantId } });
      IdentifyCode = await baseController.randomIdentifyCode(
        ModelBooking,
        "OMDL-"
      );
      List = await ModelBooking.create({
        TenantId,
        IdentifyCode,
        OrderByTime,
        OrderByTimeFrom: OrderByTimeFrom ? OrderByTimeFrom : null,
        OrderByTimeTo: OrderByTimeTo ? OrderByTimeTo : null,
        OrderByDateFrom: OrderByDateFrom ? OrderByDateFrom : null,
        OrderByDateTo: OrderByDateTo ? OrderByDateTo : null,
        PaymentTypeOnline: 1,
        PaymentStatus: 1,
        OrderNote,
        BookingUserName,
        BookingPhone,
        BookingEmail,
        BookingUserId,
        CreatorUserId,
        AffiliateCommission: OrderByTime
          ? (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByHour || 0.05)
            ).toFixed(2)
          : (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByDate || 0.05)
            ).toFixed(2),
        CommissionPercent: OrderByTime
          ? Post.AffiliateCommissionByHour || 0.05
          : Post.AffiliateCommissionByDate || 0.05,
        BookingStatus,
        ModelId: ProductId,
        ModelServiceId,
        IsPayDeposit: IsPayDeposit || 0, //default is 0, because customer can only pay the deposit after confirm the order
        IsDeleted: 0,
        BookingValue,
        CreationTime: moment(Date.now()),
        LastModificationTime: moment(Date.now()),
        IsRefund: 0,
        PromoCodeId: PromoCodeId || null,
        BookingValueBeforeDiscount,
        DepositValue: OrderByTime
          ? (BookingValue * Product.DepositByHour) / 100
          : (BookingValue * Product.DepositByDate) / 100,
        AffiliateUserId: checkAffiliateUserId ? AffiliateUserId : undefined,
        Category,
        numberOfTime,
        CancelPriceByDate: Product.CancelPriceByDate,
        CancelPriceByHour: Product.CancelPriceByHour,
        DepositByDate: Product.DepositByDate,
        DepositByHour: Product.DepositByHour,
        FreeCancelByDate: Product.FreeCancelByDate,
        FreeCancelByHour: Product.FreeCancelByHour,
      });

      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      break;
    case 3:
      Post = await ClothesPost.findByPk(ProductId);
      TenantId = Post.dataValues.TenantId;
      Partner = await RegisterPartner.findOne({ where: { Id: TenantId } });

      IdentifyCode = await baseController.randomIdentifyCode(
        ClothesBooking,
        "OCLT-"
      );
      List = await ClothesBooking.create({
        TenantId,
        IdentifyCode,
        OrderByTime,
        OrderByTimeFrom: OrderByTimeFrom ? OrderByTimeFrom : null,
        OrderByTimeTo: OrderByTimeTo ? OrderByTimeTo : null,
        OrderByDateFrom: OrderByDateFrom ? OrderByDateFrom : null,
        OrderByDateTo: OrderByDateTo ? OrderByDateTo : null,
        PaymentTypeOnline: 1,
        PaymentStatus: 1,
        OrderNote,
        BookingUserName,
        BookingPhone,
        BookingEmail,
        BookingUserId,
        CreatorUserId,
        AffiliateCommission: OrderByTime
          ? (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByHour || 0.05)
            ).toFixed(2)
          : (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByDate || 0.05)
            ).toFixed(2),
        CommissionPercent: OrderByTime
          ? Post.AffiliateCommissionByHour || 0.05
          : Post.AffiliateCommissionByDate || 0.05,
        BookingStatus,
        ClothesId: ProductId,
        IsPayDeposit: IsPayDeposit || 0, //default is 0, because customer can only pay the deposit after confirm the order
        IsDeleted: 0,
        BookingValue,
        CreationTime: moment(Date.now()),
        LastModificationTime: moment(Date.now()),
        IsRefund: 0,
        PromoCodeId: PromoCodeId || null,
        BookingValueBeforeDiscount,
        DepositValue: OrderByTime
          ? (BookingValue * Post.DepositByHour) / 100
          : (BookingValue * Post.DepositByDate) / 100,
        AffiliateUserId: checkAffiliateUserId ? AffiliateUserId : undefined,
        Category,
        numberOfTime,
        CancelPriceByDate: Post.CancelPriceByDate,
        CancelPriceByHour: Post.CancelPriceByHour,
        DepositByDate: Post.DepositByDate,
        DepositByHour: Post.DepositByHour,
        FreeCancelByDate: Post.FreeCancelByDate,
        FreeCancelByHour: Post.FreeCancelByHour,
        Size: req.body.Size,
        Color: req.body.Color,
        Amount: req.body.Amount,
      });
      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      break;
    case 4:
      Product = await MakeupServicePackage.findByPk(RoomId);
      TenantId = Product.dataValues.TenantId;
      Partner = await RegisterPartner.findOne({ where: { Id: TenantId } });
      Post = await MakeupPost.findOne({ where: { TenantId } });
      IdentifyCode = await baseController.randomIdentifyCode(
        MakeUpBooking,
        "OMKP-"
      );
      List = await MakeUpBooking.create({
        TenantId,
        IdentifyCode,
        OrderByTime,
        OrderByTimeFrom: OrderByTimeFrom ? OrderByTimeFrom : null,
        OrderByTimeTo: OrderByTimeTo ? OrderByTimeTo : null,
        OrderByDateFrom: OrderByDateFrom ? OrderByDateFrom : null,
        OrderByDateTo: OrderByDateTo ? OrderByDateTo : null,
        PaymentTypeOnline: 1,
        PaymentStatus: 1,
        OrderNote,
        BookingUserName,
        BookingPhone,
        BookingEmail,
        BookingUserId,
        AffiliateCommission: OrderByTime
          ? (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByHour || 0.05)
            ).toFixed(2)
          : (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByDate || 0.05)
            ).toFixed(2),
        CommissionPercent: OrderByTime
          ? Post.AffiliateCommissionByHour || 0.05
          : Post.AffiliateCommissionByDate || 0.05,
        CreatorUserId,
        BookingStatus,
        MakeupServicePackageId: RoomId,
        IsPayDeposit: IsPayDeposit || 0, //default is 0, because customer can only pay the deposit after confirm the order
        IsDeleted: 0,
        BookingValue,
        CreationTime: moment(Date.now()),
        LastModificationTime: moment(Date.now()),
        IsRefund: 0,
        PromoCodeId: PromoCodeId || null,
        BookingValueBeforeDiscount,
        DepositValue: OrderByTime
          ? (BookingValue * Product?.dataValues?.DepositByHour) / 100
          : (BookingValue * Product?.dataValues?.DepositByDate) / 100,
        AffiliateUserId: checkAffiliateUserId ? AffiliateUserId : undefined,
        Category,
        numberOfTime,
        CancelPriceByDate: Product.CancelPriceByDate,
        CancelPriceByHour: Product.CancelPriceByHour,
        DepositByDate: Product.DepositByDate,
        DepositByHour: Product.DepositByHour,
        FreeCancelByDate: Product.FreeCancelByDate,
        FreeCancelByHour: Product.FreeCancelByHour,
      });

      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      break;
    case 5:
      Post = await DevicePost.findByPk(ProductId);
      // Post = await ClothesPost.findOne({ where: { TenantId } });
      TenantId = Post.dataValues.TenantId;
      Partner = await RegisterPartner.findOne({ where: { Id: TenantId } });

      IdentifyCode = await baseController.randomIdentifyCode(
        DeviceBooking,
        "OCLT-"
      );
      List = await DeviceBooking.create({
        TenantId,
        IdentifyCode,
        OrderByTime,
        OrderByTimeFrom: OrderByTimeFrom ? OrderByTimeFrom : null,
        OrderByTimeTo: OrderByTimeTo ? OrderByTimeTo : null,
        OrderByDateFrom: OrderByDateFrom ? OrderByDateFrom : null,
        OrderByDateTo: OrderByDateTo ? OrderByDateTo : null,
        PaymentTypeOnline: 1,
        PaymentStatus: 1,
        OrderNote,
        BookingUserName,
        BookingPhone,
        BookingEmail,
        BookingUserId,
        CreatorUserId,
        BookingStatus,
        ClothesId: ProductId,
        IsPayDeposit: IsPayDeposit || 0, //default is 0, because customer can only pay the deposit after confirm the order
        IsDeleted: 0,
        BookingValue,
        CreationTime: moment(Date.now()),
        LastModificationTime: moment(Date.now()),
        IsRefund: 0,
        PromoCodeId: PromoCodeId || null,
        BookingValueBeforeDiscount,
        DepositValue: OrderByTime
          ? (BookingValue * Post.DepositByHour) / 100
          : (BookingValue * Post.DepositByDate) / 100,
        AffiliateUserId: checkAffiliateUserId ? AffiliateUserId : undefined,
        Category,
        AffiliateCommission: OrderByTime
          ? (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByHour || 0.05)
            ).toFixed(2)
          : (
              (BookingValue / 1.1) *
              (Post.AffiliateCommissionByDate || 0.05)
            ).toFixed(2),
        CommissionPercent: OrderByTime
          ? Post.AffiliateCommissionByHour || 0.05
          : Post.AffiliateCommissionByDate || 0.05,
        numberOfTime,
        CancelPriceByDate: Post.CancelPriceByDate,
        CancelPriceByHour: Post.CancelPriceByHour,
        DepositByDate: Post.DepositByDate,
        DepositByHour: Post.DepositByHour,
        FreeCancelByDate: Post.FreeCancelByDate,
        FreeCancelByHour: Post.FreeCancelByHour,
        Size: size,
        Color: color,
        Amount: amount,
      });
      createWebHookEvents(req, { Data: List });
      createWebHookSendAttempts();
      createWebHookSendAttempts();
      break;
    default:
      break;
  }

  if (CartItemId) {
    await CartItem.destroy({ where: { id: CartItemId } });
  }

  if (PromoCodeId) {
    const promoCode = await SaleCode.findOne({ where: { id: PromoCodeId } });
    await SaleCode.update(
      {
        NoOfJoined: Number(promoCode.dataValues.NoOfJoined) + 1,
      },
      { where: { id: PromoCodeId } }
    );

    const savedPromo = await PromoteCode_UserSave.findOne({
      where: { PromoteCodeId: PromoCodeId, BookingUserId },
    });
    await PromoteCode_UserSave.update(
      {
        Used: Number(savedPromo.dataValues.Used) + 1,
      },
      { where: { PromoteCodeId: PromoCodeId } }
    );
  }

  if (List?.dataValues?.PaymentStatus === 4) {
    const EmailData = [
      {
        key: "<!--Username-->",
        value: BookingUserName,
      },
      {
        key: "<!--IdentifyCode-->",
        value: IdentifyCode,
      },
      {
        key: "<!--Product-->",
        value: Product?.dataValues?.Name || "Không",
      },
      {
        key: "<!--Partner-->",
        value: Partner?.dataValues?.Phone || "Không",
      },
      {
        key: "<!--Start-->",
        value: moment(
          (OrderByTimeFrom ? OrderByTimeFrom : null) ||
            (OrderByDateFrom ? OrderByDateFrom : null)
        )
          .utc()
          .format(
            Booking?.dataValues?.OrderByDateTo
              ? "DD/MM/YYYY"
              : "DD/MM/YYYY hh:mm A"
          ),
      },
      {
        key: "<!--End-->",
        value: moment(
          (OrderByTimeTo ? OrderByTimeTo : null) ||
            (OrderByDateTo ? OrderByDateTo : null)
        )
          .utc()
          .format(
            Booking?.dataValues?.OrderByDateTo
              ? "DD/MM/YYYY"
              : "DD/MM/YYYY hh:mm A"
          ),
      },
      {
        key: "<!-- Phonenumber -->",
        value:
          BookingPhone === "null" || !BookingPhone ? "Không" : BookingPhone,
      },
      {
        key: "<!-- Note -->",
        value: !OrderNote ? "Không" : OrderNote,
      },
      {
        key: "<!-- Email -->",
        value: BookingEmail,
      },
      {
        key: "<!-- RangeTime -->",
        value: numberOfTime,
      },
      {
        key: "<!-- ReducePrice -->",
        value: baseController.convertPrice(
          BookingValueBeforeDiscount - BookingValue
        ),
      },
      {
        key: "<!-- BookingValue -->",
        value: baseController.convertPrice(BookingValue),
      },
      {
        key: "<!-- BookingValueLast -->",
        value: baseController.convertPrice(
          BookingValue - (List?.dataValues?.DepositValue || 0)
        ),
      },
      {
        key: "<!--PostName-->",
        value: Post?.dataValues?.Name || "Không",
      },
      {
        key: "<!--PostAddress-->",
        value: Post?.dataValues?.Address || "Không",
      },
      {
        key: "<!--PostImage-->",
        value: Post?.dataValues?.Image1 || "Không",
      },
      {
        key: "<!--DepositValue-->",
        value: List?.dataValues?.DepositValue
          ? baseController.convertPrice(List?.dataValues?.DepositValue)
          : "Không",
      },
      {
        key: "<!--TaxFee-->",
        value: baseController.convertPrice(
          Math.round(((BookingValue / 1.1) * 10) / 100)
        ),
      },
    ];
    baseController.sendHTMLmail(1, BookingEmail, EmailData);
  }
  console.log({
    IdentifyCode,
    TenantId,
    id: List.dataValues.id,
    Category: Category,
  });
  res.status(200).send({
    IdentifyCode,
    TenantId,
    id: List.dataValues.id,
    Category: Category,
  });
});

exports.updateBookingByIdentifyCode = catchAsync(async (req, res) => {
  const Image = req.file ? req.file : null;
  let { IdentifyCode } = req.params;
  let { Category, BookingStatus, PaymentStatus, DeletionTime, DeletedNote } =
    req.body;

  let booking, EvidenceImage, checkBooking, Product;
  if (!req.user.id) throw new ApiError(400, "You need to login first");

  //Check for undefined update value
  let temp = { BookingStatus, PaymentStatus, DeletionTime, DeletedNote };
  let updateVal = {};
  for (let item in temp) {
    if (temp[item] !== undefined) {
      updateVal = { ...updateVal, [item]: temp[item] };
    }
  }
  // const fifteenMinutesAgo = moment().subtract(15, "minutes").toDate();
  let CancelFreeDate;
  let check;
  switch (Number(Category)) {
    case 1:
      checkBooking = await StudioBooking.findOne({
        where: {
          IdentifyCode,
          // CreationTime: {
          //   [Op.gte]: fifteenMinutesAgo,
          // },
        },
      });
      // if (!checkBooking) {
      //   throw new ApiError(400, "Update fail");
      // }
      CancelFreeDate = moment(
        data?.OrderByTime ? data?.OrderByTimeFrom : data?.OrderByDateFrom
      )
        .subtract(
          data?.OrderByTime
            ? data?.FreeCancelByHour?.match(/\d+/g)[0]
            : data?.FreeCancelByDate?.match(/\d+/g)[0],
          `${
            data?.OrderByTime
              ? /ngày/.test(data?.FreeCancelByHour)
                ? "days"
                : "hours"
              : /ngày/.test(data?.FreeCancelByDate)
              ? "days"
              : "hours"
          }`
        )
        .utc()
        .format();
      check = moment() <= CancelFreeDate;
      const orderByTimeCancelPrice = checkBooking.OrderByTime
        ? check
          ? 0
          : (checkBooking.DepositValue * checkBooking.CancelPriceByHour) / 100
        : check
        ? 0
        : (checkBooking.DepositValue * checkBooking.CancelPriceByDate) / 100;
      if (Image) {
        EvidenceImage = await AppBinaryObject.findOne({
          where: { Id: checkBooking.dataValues.EvidenceImage },
        });

        if (EvidenceImage) {
          await AppBinaryObject.update(
            {
              Bytes: Image.buffer,
              Description: Image.originalname,
            },
            { where: { Id: checkBooking.dataValues.EvidenceImage } }
          );
        } else {
          EvidenceImage = await AppBinaryObject.create({
            Bytes: Image.buffer,
            Description: Image.originalname,
          });
        }
      }
      updateVal = {
        ...updateVal,
        EvidenceImage: Image
          ? EvidenceImage.dataValues.Id
          : checkBooking.dataValues.EvidenceImage,
        CancelPrice: orderByTimeCancelPrice,
      };
      await StudioBooking.update(updateVal, {
        where: { IdentifyCode },
        returning: true,
      });
      booking = await StudioBooking.findOne({ where: { IdentifyCode } });
      Product = await StudioRoom.findByPk(booking.dataValues.StudioRoomId);
      Post = await StudioPost.findOne({
        where: { TenantId: booking.dataValues.TenantId },
      });
      break;
    case 2:
      checkBooking = await PhotographerBooking.findOne({
        where: {
          IdentifyCode,
          //CreationTime: {
          //            [Op.gte]: fifteenMinutesAgo,
          //          },
        },
      });
      if (!checkBooking) {
        throw new ApiError(404, "Update fail");
      }
      if (Image) {
        EvidenceImage = await AppBinaryObject.findOne({
          where: { Id: checkBooking.dataValues.EvidenceImage },
        });

        if (EvidenceImage) {
          await AppBinaryObject.update(
            {
              Bytes: Image.buffer,
              Description: Image.originalname,
            },
            { where: { Id: checkBooking.dataValues.EvidenceImage } }
          );
        } else {
          EvidenceImage = await AppBinaryObject.create({
            Bytes: Image.buffer,
            Description: Image.originalname,
          });
        }
      }
      await PhotographerBooking.update(
        {
          EvidenceImage: Image
            ? EvidenceImage.dataValues.Id
            : checkBooking.dataValues.EvidenceImage,
          BookingStatus,
        },
        {
          where: { IdentifyCode },
        }
      );
      booking = await PhotographerBooking.findOne({ where: { IdentifyCode } });
      break;
    case 5:
      checkBooking = await DeviceBooking.findOne({
        where: {
          IdentifyCode,
          //CreationTime: {
          //            [Op.gte]: fifteenMinutesAgo,
          //          },
        },
      });
      if (!checkBooking) {
        throw new ApiError(404, "Update fail");
      }
      if (Image) {
        EvidenceImage = await AppBinaryObject.findOne({
          where: { Id: checkBooking.dataValues.EvidenceImage },
        });

        if (EvidenceImage) {
          await AppBinaryObject.update(
            {
              Bytes: Image.buffer,
              Description: Image.originalname,
            },
            { where: { Id: checkBooking.dataValues.EvidenceImage } }
          );
        } else {
          EvidenceImage = await AppBinaryObject.create({
            Bytes: Image.buffer,
            Description: Image.originalname,
          });
        }
      }
      await DeviceBooking.update(
        {
          EvidenceImage: Image
            ? EvidenceImage.dataValues.Id
            : checkBooking.dataValues.EvidenceImage,
          BookingStatus,
        },
        {
          where: { IdentifyCode },
        }
      );
      booking = await DeviceBooking.findOne({ where: { IdentifyCode } });
      break;
    case 3:
      checkBooking = await ClothesBooking.findOne({
        where: {
          IdentifyCode,
          //CreationTime: {
          //            [Op.gte]: fifteenMinutesAgo,
          //          },
        },
      });
      if (!checkBooking) {
        throw new ApiError(404, "Update fail");
      }
      if (Image) {
        EvidenceImage = await AppBinaryObject.findOne({
          where: { Id: checkBooking.dataValues.EvidenceImage },
        });

        if (EvidenceImage) {
          await AppBinaryObject.update(
            {
              Bytes: Image.buffer,
              Description: Image.originalname,
            },
            { where: { Id: checkBooking.dataValues.EvidenceImage } }
          );
        } else {
          EvidenceImage = await AppBinaryObject.create({
            Bytes: Image.buffer,
            Description: Image.originalname,
          });
        }
      }
      await ClothesBooking.update(
        {
          EvidenceImage: Image
            ? EvidenceImage.dataValues.Id
            : checkBooking.dataValues.EvidenceImage,
          BookingStatus,
        },
        {
          where: { IdentifyCode },
        }
      );
      booking = await ClothesBooking.findOne({ where: { IdentifyCode } });
      break;
    case 4:
      checkBooking = await MakeUpBooking.findOne({
        where: {
          IdentifyCode,
          //CreationTime: {
          //            [Op.gte]: fifteenMinutesAgo,
          //          },
        },
      });
      if (!checkBooking) {
        throw new ApiError(404, "Update fail");
      }
      if (Image) {
        EvidenceImage = await AppBinaryObject.findOne({
          where: { Id: checkBooking.dataValues.EvidenceImage },
        });

        if (EvidenceImage) {
          await AppBinaryObject.update(
            {
              Bytes: Image.buffer,
              Description: Image.originalname,
            },
            { where: { Id: checkBooking.dataValues.EvidenceImage } }
          );
        } else {
          EvidenceImage = await AppBinaryObject.create({
            Bytes: Image.buffer,
            Description: Image.originalname,
          });
        }
      }
      await MakeUpBooking.update(
        {
          EvidenceImage: Image
            ? EvidenceImage.dataValues.Id
            : checkBooking.dataValues.EvidenceImage,
          BookingStatus,
        },
        {
          where: { IdentifyCode },
        }
      );
      booking = await MakeUpBooking.findOne({ where: { IdentifyCode } });
      break;
    case 6:
      checkBooking = await ModelBooking.findOne({
        where: {
          IdentifyCode,
          //CreationTime: {
          //            [Op.gte]: fifteenMinutesAgo,
          //          },
        },
      });
      if (!checkBooking) {
        throw new ApiError(404, "Update fail");
      }
      if (Image) {
        EvidenceImage = await AppBinaryObject.findOne({
          where: { Id: checkBooking.dataValues.EvidenceImage },
        });

        if (EvidenceImage) {
          await AppBinaryObject.update(
            {
              Bytes: Image.buffer,
              Description: Image.originalname,
            },
            { where: { Id: checkBooking.dataValues.EvidenceImage } }
          );
        } else {
          EvidenceImage = await AppBinaryObject.create({
            Bytes: Image.buffer,
            Description: Image.originalname,
          });
        }
      }
      await ModelBooking.update(
        {
          EvidenceImage: Image
            ? EvidenceImage.dataValues.Id
            : checkBooking.dataValues.EvidenceImage,
          BookingStatus,
        },
        {
          where: { IdentifyCode },
        }
      );
      booking = await ModelBooking.findOne({ where: { IdentifyCode } });
      break;
    default:
      break;
  }
  if (+BookingStatus === 2) {
    const Booking = booking.dataValues;

    createWebHookEvents(req, { Data: Booking });
    createWebHookSendAttempts();
    const EmailData = [
      {
        key: "<!--Username-->",
        value: Booking.BookingUserName,
      },
      {
        key: "<!--IdentifyCode-->",
        value: Booking.IdentifyCode,
      },
      {
        key: "<!--ProductName-->",
        value: Product.dataValues.Name,
      },
      {
        key: "<!--PostName-->",
        value: Post.dataValues.Name,
      },
      {
        key: "<!--PostAddress-->",
        value: Post.dataValues.Address,
      },
      {
        key: "<!--PostImage-->",
        value: Post.dataValues.Image1,
      },
      {
        key: "<!--Start-->",
        value: moment(
          (Booking.OrderByTimeFrom ? Booking.OrderByTimeFrom : null) ||
            (Booking.OrderByDateFrom ? Booking.OrderByDateFrom : null)
        )
          .utc()
          .format(
            Booking?.OrderByDateFrom ? "DD/MM/YYYY" : "DD/MM/YYYY hh:mm A"
          ),
      },
      {
        key: "<!--End-->",
        value: moment(
          (Booking.OrderByTimeTo ? Booking.OrderByTimeTo : null) ||
            (Booking.OrderByDateTo ? Booking.OrderByDateTo : null)
        )
          .utc()
          .format(Booking?.OrderByDateTo ? "DD/MM/YYYY" : "DD/MM/YYYY hh:mm A"),
      },
      {
        key: "<!-- Phonenumber -->",
        value:
          Booking.BookingPhone === "null" || !Booking.BookingPhone
            ? "Không"
            : Booking.BookingPhone,
      },
      {
        key: "<!-- Note -->",
        value: !Booking.OrderNote ? "Không" : Booking.OrderNote,
      },
      {
        key: "<!-- Email -->",
        value: Booking.BookingEmail,
      },
      {
        key: "<!--DepositValue-->",
        value: Booking?.DepositValue
          ? baseController.convertPrice(Booking?.DepositValue)
          : "0",
      },
      {
        key: "<!--CancelValue-->",
        value: Booking?.DepositValue
          ? baseController.convertPrice(Booking?.DepositValue * 0.5)
          : "0",
      },
      {
        key: "<!--StillValue-->",
        value: Booking?.DepositValue
          ? baseController.convertPrice(
              Booking?.DepositValue - Booking?.DepositValue * 0.5
            )
          : "0",
      },
      {
        key: "<!--Link-->",
        value: `https://bookingstudio.vn/home/refund?IdentifyCode=${IdentifyCode}&category=${Category}&token=${baseController.tokenEmail(
          Category,
          IdentifyCode
        )}`,
      },
    ];
    baseController.sendHTMLmail(4, Booking.BookingEmail, EmailData);
  }

  res.status(200).send({ EvidenceImage, booking, CancelFreeDate, check });
});

exports.getAllBooking = catchAsync(async (req, res) => {
  let {
    category,
    EntryDate,
    Identify_like,
    PaymentTypeOnline,
    BookingStatus,
    PaymentStatus,
    CreateDate,
  } = req.body;
  let { page, limit } = req.query;
  const regex = /(\d+)$/;
  // const regex = /(\d+)$/;
  if (Identify_like !== "") {
    Identify_like = Identify_like.replace(/\s+/g, "");
  }
  let options = {
    [Op.or]: [
      {
        IdentifyCode: {
          [Op.like]: Identify_like !== "" ? `%${Identify_like}%` : "%%",
        },
      },
      {
        BookingUserId: {
          [Op.like]: Identify_like.match(regex)
            ? parseInt(Identify_like.match(regex)[1])
            : null,
        },
      },
      {
        BookingEmail: {
          [Op.like]: Identify_like !== "" ? `%${Identify_like}%` : "%%",
        },
      },
      {
        BookingPhone: {
          [Op.like]: Identify_like !== "" ? `%${Identify_like}%` : "%%",
        },
      },
      {
        BookingUserName: {
          [Op.like]: Identify_like !== "" ? `%${Identify_like}%` : "%%",
        },
      },
    ],
  };
  if (EntryDate?.startDate !== "" || EntryDate?.endDate !== "") {
    options = {
      [Op.and]: [
        {
          [Op.or]: [
            {
              OrderByDateFrom: {
                [Op.gte]: EntryDate?.startDate
                  ? moment(EntryDate.startDate).startOf("day").utc()
                  : 1,
                [Op.lte]: EntryDate?.endDate
                  ? moment(EntryDate.endDate).endOf("day").utc()
                  : moment().utc(),
              },
            },
            {
              OrderByTimeFrom: {
                [Op.gte]: EntryDate?.startDate
                  ? moment(EntryDate.startDate).startOf("day").utc()
                  : 1,
                [Op.lte]: EntryDate?.endDate
                  ? moment(EntryDate.endDate).endOf("day").utc()
                  : moment().utc(),
              },
            },
          ],
        },
        {
          ...options,
        },
      ],
    };
  }
  if (CreateDate?.startDate !== "" || CreateDate?.endDate !== "") {
    options = {
      [Op.and]: [
        {
          [Op.or]: [
            {
              CreationTime: {
                [Op.gte]: CreateDate?.startDate
                  ? moment(CreateDate.startDate).startOf("day").utc()
                  : 1,
                [Op.lte]: CreateDate?.endDate
                  ? moment(CreateDate.endDate).endOf("day").utc()
                  : moment().utc(),
              },
            },
          ],
        },
        {
          ...options,
        },
      ],
    };
  }
  if (PaymentTypeOnline) {
    options["PaymentTypeOnline"] = PaymentTypeOnline;
  }
  if (BookingStatus) {
    options["BookingStatus"] = BookingStatus;
  }
  if (PaymentStatus) {
    options["PaymentStatus"] = PaymentStatus;
  }
  let condition = {
    where: options,
    order: [["CreationTime", "DESC"]],
  };
  let List;
  switch (+category) {
    case 1:
      List = await baseController.Pagination(
        StudioBooking,
        page,
        limit,
        {
          ...condition,
        },
        [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: StudioRoom,
          },
        ]
      );
      break;
    case 2:
      List = await baseController.Pagination(PhotographerBooking, page, limit, {
        ...condition,
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: PhotographerServicePackage,
          },
        ],
      });
      break;
    case 5:
      List = await baseController.Pagination(
        DeviceBooking,
        page,
        limit,
        condition
      );
      break;
    case 3:
      List = await baseController.Pagination(
        ClothesBooking,
        page,
        limit,
        condition
      );
      break;
    case 4:
      List = await baseController.Pagination(MakeUpBooking, page, limit, {
        ...condition,
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: MakeupServicePackage,
          },
        ],
      });
      break;
    case 6:
      List = await baseController.Pagination(
        ModelBooking,
        page,
        limit,
        {
          ...condition,
        },
        [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: ModelServicePackage,
          },
        ]
      );
      break;
    default:
      break;
  }
  res.status(200).send(List);
});

exports.getBookingPersonal = catchAsync(async (req, res) => {
  let { EntryDate, BookingStatus, PaymentStatus } = req.query;
  const BookingUserId = req.user.id;
  if (EntryDate) EntryDate = JSON.parse(EntryDate);

  let condition = {
    where: {
      BookingUserId: BookingUserId,
      BookingStatus: BookingStatus ? BookingStatus : null,
      PaymentStatus: PaymentStatus ? PaymentStatus : null,
      [Op.or]: [
        {
          OrderByDateFrom: {
            [Op.gte]: EntryDate?.startDate ? new Date(EntryDate.startDate) : 1,
          },
          OrderByDateTo: {
            [Op.lte]: EntryDate?.endDate
              ? new Date(EntryDate.endDate)
              : new Date().setHours(new Date().getHours() + 10000000),
          },
        },
        {
          OrderByTimeFrom: {
            [Op.gte]: EntryDate?.startDate ? new Date(EntryDate.startDate) : 1,
          },
          OrderByTimeTo: {
            [Op.lte]: EntryDate?.endDate
              ? new Date(EntryDate.endDate)
              : new Date().setHours(new Date().getHours() + 100000),
          },
        },
      ],
    },
    order: [["CreationTime", "DESC"]],
  };

  let List;
  List = await StudioBooking.findAll({
    ...condition,
    include: [
      {
        model: StudioRoom,
        attributes: ["Name", "Image1"],
      },
    ],
  });
  const List1 = List.map((item) => ({
    ...item.toJSON(),
    category: 1,
    Item: item.StudioRoom,
    StudioRoom: null,
  }));
  List = await PhotographerBooking.findAll({
    ...condition,
    include: [
      {
        model: PhotographerServicePackage,
        attributes: ["Name", "Image1"],
      },
    ],
  });
  const List2 = List.map((item) => ({
    ...item.toJSON(),
    category: 2,
    Item: item.PhotographerServicePackage,
    PhotographerServicePackage: null,
  }));
  List = await DeviceBooking.findAll({
    ...condition,
  });
  const List3 = List.map((item) => ({ ...item.toJSON(), category: 5 }));
  List = await ClothesBooking.findAll({
    ...condition,
  });
  const List4 = List.map((item) => ({ ...item.toJSON(), category: 3 }));
  List = await MakeUpBooking.findAll({
    ...condition,
    include: [
      {
        model: MakeupServicePackage,
        attributes: ["Name", "Image1"],
      },
    ],
  });
  const List5 = List.map((item) => ({
    ...item.toJSON(),
    category: 4,
    Item: item.MakeupServicePackage,
    MakeupServicePackage: null,
  }));
  List = await ModelBooking.findAll({
    ...condition,
    include: [
      {
        model: ModelServicePackage,
        attributes: ["Name", "Image1"],
      },
    ],
  });
  const List6 = List.map((item) => ({
    ...item.toJSON(),
    category: 6,
    Item: item.ModelServicePackage,
    ModelServicePackage: null,
  }));

  const ListMerge = [
    ...List1,
    ...List2,
    ...List3,
    ...List4,
    ...List5,
    ...List6,
  ].sort((a, b) => new Date(b.CreationTime) - new Date(a.CreationTime));
  res.status(200).json({ success: true, data: ListMerge });
});

exports.getOrderStatus = catchAsync(async (req, res) => {
  let { BookingStatus, PaymentStatus } = req.query;
  const BookingUserId = req.user.id;
  let condition = {
    where: {
      BookingUserId: BookingUserId,
      BookingStatus: BookingStatus ? BookingStatus : "",
      PaymentStatus: { [Op.in]: PaymentStatus },
    },
    order: [["CreationTime", "DESC"]],
  };
  let List;
  List = await StudioBooking.findAll({
    ...condition,
    include: [
      {
        model: StudioRoom,
        attributes: ["Name", "Image1"],
        include: [{ model: StudioPost, attributes: ["IsVisible", "Name"] }],
      },
    ],
  });
  const List1 = List.map((item) => ({
    ...item.toJSON(),
    category: 1,
    Item: item.StudioRoom,
    StudioRoom: null,
  }));
  List = await PhotographerBooking.findAll({
    ...condition,
    include: [
      {
        model: PhotographerServicePackage,
        attributes: ["Name", "Image1"],
      },
    ],
  });
  const List2 = List.map((item) => ({
    ...item.toJSON(),
    category: 2,
    Item: item.PhotographerServicePackage,
    PhotographerServicePackage: null,
  }));
  List = await DeviceBooking.findAll({
    ...condition,
  });
  const List3 = List.map((item) => ({ ...item.toJSON(), category: 5 }));
  List = await ClothesBooking.findAll({
    ...condition,
  });
  const List4 = List.map((item) => ({ ...item.toJSON(), category: 3 }));
  List = await MakeUpBooking.findAll({
    ...condition,
    include: [
      {
        model: MakeupServicePackage,
        attributes: ["Name", "Image1"],
      },
    ],
  });
  const List5 = List.map((item) => ({
    ...item.toJSON(),
    category: 4,
    Item: item.MakeupServicePackage,
    MakeupServicePackage: null,
  }));
  List = await ModelBooking.findAll({
    ...condition,
    include: [
      {
        model: ModelServicePackage,
        as: "Bookings",
        attributes: ["Name", "Image1"],
      },
    ],
  });
  const List6 = List.map((item) => {
    return {
      ...item.toJSON(),
      category: 6,
      Item: item.dataValues.Bookings,
      ModelServicePackage: null,
    };
  });

  const ListMerge = [
    ...List1,
    ...List2,
    ...List3,
    ...List4,
    ...List5,
    ...List6,
  ].sort((a, b) =>
    BookingStatus !== 2
      ? new Date(b.CreationTime) - new Date(a.CreationTime)
      : new Date(b.DeletionTime) - new Date(a.DeletionTime)
  );
  res.status(200).json({ success: true, data: ListMerge });
});

exports.getBookingByIdentifyCode = catchAsync(async (req, res) => {
  const { identifyCode, category } = req.query;
  let List;
  switch (+category) {
    case 1:
      List = await StudioBooking.findOne({
        where: { IdentifyCode: identifyCode },
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: StudioRoom,
          },
          { model: SaleCode },
        ],
      });
      break;
    case 2:
      List = await PhotographerBooking.findOne({
        where: { IdentifyCode: identifyCode },
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: PhotographerServicePackage,
          },
        ],
      });
      break;
    case 4:
      List = await MakeUpBooking.findOne({
        where: { IdentifyCode: identifyCode },
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: MakeupServicePackage,
          },
        ],
      });
      break;
    case 5:
      List = await DeviceBooking.findOne({
        where: { IdentifyCode: identifyCode },
      });
      break;
    case 3:
      List = await ClothesBooking.findOne({
        where: { IdentifyCode: identifyCode },
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          { model: SaleCode },
        ],
      });
      break;
    case 6:
      List = await ModelBooking.findOne({
        where: { IdentifyCode: identifyCode },
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: ModelServicePackage,
            as: "Bookings",
          },
        ],
      });
      break;
    default:
      break;
  }
  res.status(200).send(List);
});

exports.getBookingById = catchAsync(async (req, res) => {
  const { id, category } = req.query;
  let List;
  switch (+category) {
    case 1:
      List = await StudioBooking.findByPk(id, {
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: StudioRoom,
          },
          { model: SaleCode },
        ],
      });
      break;
    case 2:
      List = await PhotographerBooking.findByPk(id, {
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: PhotographerServicePackage,
          },
        ],
      });
      break;
    case 4:
      List = await MakeUpBooking.findByPk(id, {
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: MakeupServicePackage,
          },
        ],
      });
      break;
    case 5:
      List = await DeviceBooking.findByPk(id, {});
      break;
    case 3:
      List = await ClothesBooking.findByPk(id, {
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          { model: SaleCode },
        ],
      });
      break;
    case 6:
      List = await ModelBooking.findByPk(id, {
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: ModelServicePackage,
          },
        ],
      });
      break;
    default:
      break;
  }
  res.status(200).send(List);
});

exports.getLatestBookingByUserId = catchAsync(async (req, res) => {
  const { UserId, PartnerId } = req.query;
  let latestBooking = await StudioBooking.findAll({
    where: {
      BookingUserId: UserId,
      TenantId: PartnerId,
      BookingStatus: 4,
    },
    order: [["CreationTime", "desc"]],
  });
  res.json({
    success: true,
    message: "Successfully retrieve data",
    payload: latestBooking,
  });
});

exports.updateBookingById = catchAsync(async (req, res) => {
  const { id, category } = req.query;
  const {
    OrderByTime,
    OrderByTimeFrom,
    OrderByTimeTo,
    OrderByDateFrom,
    PaymentTypeOnline,
    OrderByDateTo,
    PaymentType,
    OrderNote,
    BookingUserName,
    BookingPhone,
    BookingEmail,
    BookingStatus,
    PromoCodeId,
    IsDeleted,
    DeleterUserId,
    DeletionTime,
    EvidenceImage,
    IsPayDeposit,
    LastModifierUserId,
    PaymentStatus,
    IsRefund,
    TenantId,
    DeletedNote,
  } = req.body;
  const BookingStatuses = [1, 2, 3, 4];
  const replaceCondition = {
    OrderByTime,
    OrderByTimeFrom,
    PaymentTypeOnline,
    OrderByTimeTo,
    PaymentStatus,
    OrderByDateFrom,
    OrderByDateTo,
    PaymentTypeOnline,
    PaymentType,
    BookingStatus,
    OrderNote,
    BookingUserName,
    BookingPhone,
    BookingEmail,
    PromoCodeId,
    LastModificationTime: moment(Date.now()),
    LastModifierUserId,
    IsDeleted,
    DeleterUserId,
    DeletionTime,
    EvidenceImage,
    IsPayDeposit,
    PaymentStatus,
    IsRefund,
    DeletedNote,
  };
  if (!BookingStatuses.includes(+BookingStatus)) {
    throw new ApiError(500, "Wrong type of booking status 1,2,3,4]");
  }
  let Booking, Product, Partner, Post;
  switch (+category) {
    case 1:
      await StudioBooking.update(replaceCondition, {
        where: { id },
      });

      Booking = await StudioBooking.findByPk(id);
      Product = await StudioRoom.findByPk(Booking?.dataValues?.StudioRoomId);
      Post = await StudioPost.findOne({ where: { TenantId } });
      break;
    case 2:
      await PhotographerBooking.update(replaceCondition, {
        where: {
          id,
        },
      });
      Booking = await PhotographerBooking.findByPk(id);
      Product = await PhotographerServicePackage.findByPk(
        Booking.dataValues.PhotographerServicePackageId
      );
      Post = await PhotographerPost.findOne({ where: { TenantId } });
      break;
    case 4:
      await MakeUpBooking.update(replaceCondition, {
        where: {
          id,
        },
      });
      Booking = await MakeUpBooking.findByPk(id);
      Product = await MakeupServicePackage.findByPk(
        Booking.dataValues.MakeupServicePackageId
      );
      Post = await MakeupPost.findOne({ where: { TenantId } });
      break;
    case 5:
      await DeviceBooking.update(replaceCondition, {
        where: {
          id,
        },
      });
      Booking = await DeviceBooking.findByPk(id);

      break;
    case 3:
      await ClothesBooking.update(replaceCondition, {
        where: {
          id,
        },
      });
      Booking = await ClothesBooking.findByPk(id);

      break;
    case 6:
      await ModelBooking.update(replaceCondition, {
        where: {
          id,
        },
      });
      Booking = await ModelBooking.findByPk(id);
      Product = await ModelServicePackage.findByPk(Booking.dataValues.ModelId);
      Post = await ModelPost.findOne({ where: { TenantId } });

      break;
    default:
      break;
  }
  Partner = await RegisterPartner.findByPk(TenantId);
  const CancleFreeDate = moment(
    Booking?.OrderByTime ? Booking?.OrderByTimeFrom : Booking?.OrderByDateFrom
  )
    .subtract(
      Booking?.dataValues?.OrderByTime
        ? Product?.dataValues?.FreeCancelByHour?.match(/\d+/g)[0]
        : Product?.dataValues?.FreeCancelByDate?.match(/\d+/g)[0],
      `${Booking?.dataValues?.OrderByTime ? "hours" : "days"}`
    )
    .utc()
    .format("DD/MM/YYYY HH:mm A");

  //read and send email
  if ([4].includes(+BookingStatus) && [2, 3, 4].includes(+PaymentStatus)) {
    const EmailData = [
      {
        key: "<!--Username-->",
        value: BookingUserName,
      },
      {
        key: "<!--IdentifyCode-->",
        value: Booking?.dataValues?.IdentifyCode,
      },
      {
        key: "<!--Product-->",
        value: Product?.dataValues?.Name || "Không",
      },
      {
        key: "<!--Partner-->",
        value: Partner?.dataValues?.Phone || "Không",
      },
      {
        key: "<!--Start-->",
        value: moment(
          (Booking?.dataValues?.OrderByTimeFrom
            ? Booking?.dataValues?.OrderByTimeFrom
            : null) ||
            (Booking?.dataValues?.OrderByDateFrom
              ? Booking?.dataValues?.OrderByDateFrom
              : null)
        )
          .utc()
          .format(
            Booking?.dataValues?.OrderByDateFrom
              ? "DD/MM/YYYY"
              : "DD/MM/YYYY hh:mm A"
          ),
      },
      {
        key: "<!--End-->",
        value: moment(
          (Booking?.dataValues?.OrderByTimeTo
            ? Booking?.dataValues?.OrderByTimeTo
            : null) ||
            (Booking?.dataValues?.OrderByDateTo
              ? Booking?.dataValues?.OrderByDateTo
              : null)
        )
          .utc()
          .format(
            Booking?.dataValues?.OrderByDateTo
              ? "DD/MM/YYYY"
              : "DD/MM/YYYY hh:mm A"
          ),
      },
      {
        key: "<!-- Phonenumber -->",
        value:
          Booking?.dataValues?.BookingPhone === "null" ||
          !Booking?.dataValues?.BookingPhone
            ? "Không"
            : BookingPhone,
      },
      {
        key: "<!-- Note -->",
        value: !Booking?.dataValues?.OrderNote
          ? "Không"
          : Booking?.dataValues?.OrderNote,
      },
      {
        key: "<!-- Email -->",
        value: Booking?.dataValues?.BookingEmail,
      },
      {
        key: "<!-- RangeTime -->",
        value: Booking?.dataValues?.numberOfTime,
      },
      {
        key: "<!-- ReducePrice -->",
        value: baseController.convertPrice(
          Booking?.dataValues?.BookingValueBeforeDiscount -
            Booking?.dataValues?.BookingValue
        ),
      },
      {
        key: "<!-- BookingValue -->",
        value: baseController.convertPrice(Booking?.dataValues?.BookingValue),
      },
      {
        key: "<!-- BookingValueLast -->",
        value: baseController.convertPrice(
          Booking?.dataValues?.BookingValue -
            (Booking?.dataValues?.DepositValue || 0)
        ),
      },
      {
        key: "<!--PostName-->",
        value: Post?.dataValues?.Name || "Không",
      },
      {
        key: "<!--PostAddress-->",
        value: Post?.dataValues?.Address || "Không",
      },
      {
        key: "<!--PostImage-->",
        value: Post?.dataValues?.Image1 || "Không",
      },
      {
        key: "<!--DepositValue-->",
        value:
          Booking?.dataValues?.PaymentStatus !== 4
            ? baseController.convertPrice(Booking?.dataValues?.DepositValue)
            : "Không",
      },
      {
        key: "<!--TaxFee-->",
        value: baseController.convertPrice(
          Math.round(((Booking?.dataValues?.BookingValue / 1.1) * 10) / 100)
        ),
      },
      {
        key: "<!--CancleFreeDate-->",
        value: CancleFreeDate,
      },
      {
        key: "<!--id-->",
        value: id,
      },
      {
        key: "<!--category-->",
        value: category,
      },
    ];
    baseController.sendHTMLmail(1, BookingEmail, EmailData);
  }

  res.status(200).json({
    success: true,
    message: "Update success",
  });
});

exports.updateRefundBookingById = catchAsync(async (req, res) => {
  const { IdentifyCode, category, token } = req.query;
  const { accountUser, bank, bankAccount, bankId } = req.body;
  if (!baseController.checkTokenEmail(category, IdentifyCode, token))
    throw new ApiError(500, "Vui lòng thử lại sau!!!!");
  const replaceCondition = {
    accountUser,
    bank,
    bankAccount,
    bankId,
  };
  let check;
  switch (+category) {
    case 1:
      check = await StudioBooking.findOne({
        where: { IdentifyCode, BookingStatus: 2 },
      });
      if (!check)
        throw new ApiError(500, "Đơn hàng này không trong trạng thái huỷ");
      if (check?.dataValues?.bankAccount) {
        throw new ApiError(500, "Đơn hàng này đã có thông tin hoàn tiền");
      }
      await StudioBooking.update(replaceCondition, {
        where: { IdentifyCode, BookingStatus: 2 },
      });
      break;
    case 2:
      check = await PhotographerBooking.findOne({
        where: { IdentifyCode, BookingStatus: 2 },
      });
      if (check?.dataValues?.bankAccount) {
        throw new ApiError(500, "Đơn hàng này đã có thông tin hoàn tiền");
      }
      await PhotographerBooking.update(replaceCondition, {
        where: {
          IdentifyCode,
          BookingStatus: 2,
        },
      });

      break;
    case 4:
      check = await MakeUpBooking.findOne({
        where: { IdentifyCode, BookingStatus: 2 },
      });
      if (check?.dataValues?.bankAccount) {
        throw new ApiError(500, "Đơn hàng này đã có thông tin hoàn tiền");
      }
      await MakeUpBooking.update(replaceCondition, {
        where: {
          IdentifyCode,
          BookingStatus: 2,
        },
      });
      break;
    case 5:
      await DeviceBooking.update(replaceCondition, {
        where: {
          IdentifyCode,
          BookingStatus: 2,
        },
      });
      break;
    case 3:
      await ClothesBooking.update(replaceCondition, {
        where: {
          IdentifyCode,
          BookingStatus: 2,
        },
      });
      break;
    case 6:
      check = await ModelBooking.findOne({
        where: { IdentifyCode, BookingStatus: 2 },
      });
      if (check?.dataValues?.bankAccount) {
        throw new ApiError(500, "Đơn hàng này đã có thông tin hoàn tiền");
      }
      await ModelBooking.update(replaceCondition, {
        where: {
          IdentifyCode,
          BookingStatus: 2,
        },
      });
      break;
    default:
      break;
  }

  res.status(200).json({
    success: true,
  });
});

exports.filterBooking = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const { OrderDate, PaymentType, BookingStatus, IsPayDeposit } = req.body;
  if (
    OrderDate?.startDate ||
    OrderDate?.endDate ||
    PaymentType !== "" ||
    BookingStatus !== "" ||
    IsPayDeposit !== ""
  ) {
    const listBooking = await baseController.Pagination(
      StudioBooking,
      page,
      limit,
      {
        where: {
          OrderByDateFrom: {
            [Op.gte]: OrderDate?.startDate
              ? moment(OrderDate.startDate).format()
              : 1,
            [Op.lte]: OrderDate?.endDate
              ? moment(OrderDate.endDate).format()
              : new Date(),
          },
          PaymentType: PaymentType
            ? { [Op.in]: [PaymentType] }
            : { [Op.notIn]: "" },
          BookingStatus: BookingStatus
            ? { [Op.in]: [BookingStatus] }
            : { [Op.notIn]: "" },
          IsPayDeposit: IsPayDeposit
            ? { [Op.in]: [IsPayDeposit] }
            : { [Op.notIn]: "" },
        },
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: StudioRoom,
          },
        ],
      }
    );
    return res.status(200).send(listBooking);
  } else {
    const listBooking = await baseController.Pagination(
      StudioBooking,
      page,
      limit,
      {
        include: [
          {
            model: BookingUser,
            as: "user",
          },
          {
            model: StudioRoom,
          },
        ],
      }
    );

    return res.status(200).send(listBooking);
  }
});

exports.manuallyUpdateForAdmin = catchAsync(async (req, res) => {
  const { IsPayDeposit, PaymentStatus, BookingStatus } = req.body;
  let { id } = req.params;

  const reqField = { IsPayDeposit, PaymentStatus, BookingStatus };

  for (let item in reqField) {
    if (!item) return;
    await StudioBooking.update(
      {
        [item]: reqField[item],
      },
      {
        where: {
          IdentifyCode: id,
        },
      }
    );
  }

  res.json({
    success: true,
    message: "Successfully update field",
  });
});

exports.scheduleAndPrice = catchAsync(async (req, res) => {
  const { from, to, category, serviceId } = req.query;
  const startDate = moment(from);
  const endDate = moment(to);
  const dates = [];

  let results, room, service;

  for (let d = startDate; d <= endDate; d = d.clone().add(1, "d")) {
    dates.push(d.format());
  }
  switch (Number(category)) {
    case 1:
      room = await StudioRoom.findByPk(serviceId);
      results = await Promise.all(
        dates.map(async (item) => {
          const rs = await ScheduleAndPriceStudioByDate.findOne({
            where: { DateTime: item, RoomId: serviceId },
          });
          if (rs) {
            return {
              date: item,
              PriceByDate: rs.PriceByDate,
              PriceByHour: rs.PriceByHour,
            };
          }
          return {
            date: item,
            PriceByDate: room?.PriceByDate,
            PriceByHour: room?.PriceByHour,
          };
        })
      );
      break;
    case 2:
      service = await PhotographerServicePackage.findByPk(serviceId);
      results = await Promise.all(
        dates.map(async (item) => {
          const rs = await ScheduleAndPricePhotographerByDate.findOne({
            where: { DateTime: item, ServiceId: serviceId },
          });
          if (rs) {
            return {
              date: item,
              PriceByDate: rs.PriceByDate,
              PriceByHour: rs.PriceByHour,
            };
          }
          return {
            date: item,
            PriceByDate: service?.PriceByDate,
            PriceByHour: service?.PriceByHour,
          };
        })
      );
      break;
    case 3:
      service = await ClothesPost.findByPk(serviceId);
      results = await Promise.all(
        dates.map(async (item) => {
          const rs = await ScheduleAndPriceClothesByDate.findOne({
            where: { DateTime: item, ServiceId: serviceId },
          });
          if (rs) {
            return {
              date: item,
              PriceByDate: rs.PriceByDate,
              PriceByHour: rs.PriceByHour,
            };
          }
          return {
            date: item,
            PriceByDate: service?.PriceByDate,
            PriceByHour: service?.PriceByHour,
          };
        })
      );
      break;
    case 4:
      service = await MakeupServicePackage.findByPk(serviceId);
      results = await Promise.all(
        dates.map(async (item) => {
          const rs = await ScheduleAndPriceMakeUpByDate.findOne({
            where: { DateTime: item, ServiceId: serviceId },
          });
          if (rs) {
            return {
              date: item,
              PriceByDate: rs.PriceByDate,
              PriceByHour: rs.PriceByHour,
            };
          }
          return {
            date: item,
            PriceByDate: service?.PriceByDate,
            PriceByHour: service?.PriceByHour,
          };
        })
      );
      break;
    case 5:
      service = await DevicePost.findByPk(serviceId);
      results = await Promise.all(
        dates.map(async (item) => {
          const rs = await ScheduleAndPriceDeviceByDate.findOne({
            where: { DateTime: item, ServiceId: serviceId },
          });
          if (rs) {
            return {
              date: item,
              PriceByDate: rs.PriceByDate,
              PriceByHour: rs.PriceByHour,
            };
          }
          return {
            date: item,
            PriceByDate: service?.PriceByDate,
            PriceByHour: service?.PriceByHour,
          };
        })
      );
      break;
    case 6:
      service = await ModelServicePackage.findByPk(serviceId);
      results = await Promise.all(
        dates.map(async (item) => {
          const rs = await ScheduleAndPriceModelByDate.findOne({
            where: {
              DateTime: item,
              ServiceId: serviceId,
            },
          });
          if (rs) {
            return {
              date: item,
              PriceByDate: rs.PriceByDate,
              PriceByHour: rs.PriceByHour,
            };
          }
          return {
            date: item,
            PriceByDate: service?.PriceByDate,
            PriceByHour: service?.PriceByHour,
          };
        })
      );
      break;

    default:
      break;
  }
  res.status(200).json({ serviceId, prices: results });
});

exports.checkOrderTimeExits = catchAsync(async (req, res) => {
  const {
    OrderByTime,
    OrderByTimeFrom,
    OrderByTimeTo,
    OrderByDateFrom,
    OrderByDateTo,
    Category,
    ServiceId,
  } = req.body;
  const conditionTime = OrderByTime
    ? {
        [Op.or]: {
          OrderByTimeFrom: {
            [Op.between]: [moment(OrderByTimeFrom), moment(OrderByTimeTo)],
          },
          OrderByTimeTo: {
            [Op.between]: [moment(OrderByTimeFrom), moment(OrderByTimeTo)],
          },
        },
      }
    : {
        [Op.or]: {
          OrderByDateFrom: {
            [Op.between]: [moment(OrderByDateFrom), moment(OrderByDateTo)],
          },
          OrderByDateTo: {
            [Op.between]: [moment(OrderByDateFrom), moment(OrderByDateTo)],
          },
        },
      };
  let booking;
  switch (Number(Category)) {
    case 1:
      booking = await StudioBooking.findOne({
        where: {
          ...conditionTime,
          StudioRoomId: ServiceId,
          BookingStatus: { [Op.ne]: 2 },
        },
      });
      break;
    case 2:
      booking = await PhotographerServicePackage.findByPk(ServiceId);
      break;
    case 3:
      booking = await ClothesPost.findByPk(ServiceId);
      break;
    case 4:
      booking = await MakeupServicePackage.findByPk(ServiceId);
      break;
    case 5:
      booking = await DevicePost.findByPk(ServiceId);
      break;
    case 6:
      booking = await ModelServicePackage.findByPk(ServiceId);
      break;
    default:
      break;
  }
  res.status(200).json(booking ? { success: true } : { success: false });
});

exports.getAllBookingPartner = catchAsync(async (req, res) => {
  let {
    category,
    EntryDate,
    Identify_like = "",
    PaymentTypeOnline,
    BookingStatus,
    PaymentStatus,
  } = req.body;
  const TenantId = req.user.id;
  let { page, limit } = req.query;
  // const regex = /(\d+)$/;
  if (Identify_like !== "") {
    Identify_like = Identify_like.replace(/\s+/g, "");
  }
  let options = {
    [Op.or]: [
      {
        IdentifyCode: {
          [Op.like]: Identify_like !== "" ? `%${Identify_like}%` : "%%",
        },
      },
      {
        BookingEmail: {
          [Op.like]: Identify_like !== "" ? `%${Identify_like}%` : "%%",
        },
      },
      {
        BookingPhone: {
          [Op.like]: Identify_like !== "" ? `%${Identify_like}%` : "%%",
        },
      },
      {
        BookingUserName: {
          [Op.like]: Identify_like !== "" ? `%${Identify_like}%` : "%%",
        },
      },
    ],
  };
  if (EntryDate?.startDate !== "" || EntryDate?.endDate !== "") {
    options = {
      [Op.and]: [
        {
          [Op.or]: [
            {
              OrderByDateFrom: {
                [Op.gte]: EntryDate?.startDate
                  ? moment(EntryDate.startDate).startOf("day").utc()
                  : 1,
                [Op.lte]: EntryDate?.endDate
                  ? moment(EntryDate.endDate).endOf("day").utc()
                  : moment().endOf("year"),
              },
            },
            {
              OrderByTimeFrom: {
                [Op.gte]: EntryDate?.startDate
                  ? moment(EntryDate.startDate).startOf("day").utc()
                  : 1,
                [Op.lte]: EntryDate?.endDate
                  ? moment(EntryDate.endDate).endOf("day").utc()
                  : moment().endOf("year"),
              },
            },
          ],
        },
        {
          ...options,
        },
      ],
    };
  }
  // if (PaymentTypeOnline) {
  //   options["PaymentTypeOnline"] = PaymentTypeOnline;
  // }
  if (BookingStatus) {
    options["BookingStatus"] = BookingStatus;
  } else {
    options["BookingStatus"] = [1, 2, 3, 4];
  }
  if (PaymentStatus) {
    options["PaymentStatus"] = PaymentStatus;
  } else {
    options["PaymentStatus"] = [2, 3, 4];
  }
  let condition = {
    where: { ...options, TenantId },
    order: [["CreationTime", "DESC"]],
  };
  const getListByCategory = async (category, condition, page, limit) => {
    let List;

    switch (+category) {
      case 1:
        List = await StudioBooking.findAll({
          ...condition,
          include: [
            {
              model: BookingUser,
              as: "user",
            },
            {
              model: StudioRoom,
            },
          ],
        });
        break;
      case 2:
        List = await PhotographerBooking.findAll({
          ...condition,
          include: [
            {
              model: BookingUser,
              as: "user",
            },
            {
              model: PhotographerServicePackage,
            },
          ],
        });
        break;
      case 5:
        List = await baseController.Pagination(
          DeviceBooking,
          page,
          limit,
          condition
        );
        break;
      case 3:
        List = await baseController.Pagination(
          ClothesBooking,
          page,
          limit,
          condition
        );
        break;
      case 4:
        List = await MakeUpBooking.findAll({
          ...condition,
          include: [
            {
              model: BookingUser,
              as: "user",
            },
            {
              model: MakeupServicePackage,
            },
          ],
        });
        break;
      case 6:
        List = await ModelBooking.findAll({
          ...condition,
          include: [
            {
              model: BookingUser,
              as: "user",
            },
            // {
            //   model: ModelServicePackage,
            // },
          ],
        });
        break;
      default:
        break;
    }

    return List || [];
  };

  const getAllLists = async (condition, page, limit) => {
    let categoryPromises;
    if (!category) {
      categoryPromises = [1, 2, 4, 6].map((category) =>
        getListByCategory(category, condition, page, limit)
      );
    } else {
      categoryPromises = [category].map((category) =>
        getListByCategory(category, condition, page, limit)
      );
    }
    const allLists = await Promise.all(categoryPromises);
    return allLists.flat();
  };
  const List = await getAllLists(condition, page, limit);

  res.status(200).send(List);
});
