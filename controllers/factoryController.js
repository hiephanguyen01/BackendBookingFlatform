const { Op } = require("sequelize");
const catchAsync = require("../middlewares/async");
const {
  sequelize,
  AppBinaryObject,
  StudioPost,
  StudioBooking,
  StudioRoom,
  PhotographerPost,
  PhotographerBooking,
  PhotographerServicePackage,
  ClothesPost,
  MakeupPost,
  MakeupServicePackage,
  MakeUpBooking,
  ModelPost,
  ModelServicePackage,
  ModelBooking,
  ClothesBooking,
  DeviceBooking,
  DevicePost,
  StudioPost_User,
  PhotographerPost_User,
  ClothesPost_User,
  DevicePost_User,
  MakeupPost_User,
  ModelPost_User,
} = require("../models");
const ApiError = require("../utils/ApiError");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");
const {
  createWebHookEvents,
  createWebHookSendAttempts,
} = require("./adminWebhook");
const moment = require("moment");

exports.getTop10Oder = (Model, category) =>
  catchAsync(async (req, res) => {
    let data;
    switch (Model) {
      case StudioPost:
        data = await StudioPost.findAll({
          where: {
            IsVisible: true,
          },
          group: ["Id"],
          order: [["BookingCount", "DESC"]],
          limit: 10,
          include: {
            model: StudioPost_User,
            as: "UsersLiked",
            attributes: ["UserId"],
          },
        });
        break;
      case PhotographerPost:
        data = await PhotographerPost.findAll({
          where: {
            IsVisible: true,
          },
          group: ["Id"],
          order: [["BookingCount", "DESC"]],
          limit: 10,
          include: {
            model: PhotographerPost_User,
            as: "UsersLiked",
            attributes: ["UserId"],
          },
        });
        break;
      case ClothesPost:
        data = await ClothesPost.findAll({
          where: {
            IsVisible: true,
          },
          group: ["Id"],
          order: [["BookingCount", "DESC"]],
          limit: 10,
          include: {
            model: ClothesPost_User,
            as: "UsersLiked",
            attributes: ["UserId"],
          },
        });
        break;
      case MakeupPost:
        data = await MakeupPost.findAll({
          where: {
            IsVisible: true,
          },
          group: ["Id"],
          order: [["BookingCount", "DESC"]],
          limit: 10,
          include: {
            model: MakeupPost_User,
            as: "UsersLiked",
            attributes: ["UserId"],
          },
        });
        break;
      case DevicePost:
        data = await DevicePost.findAll({
          where: {
            IsVisible: true,
          },
          group: ["Id"],
          order: [["BookingCount", "DESC"]],
          limit: 10,
          include: {
            model: DevicePost_User,
            as: "UsersLiked",
            attributes: ["UserId"],
          },
        });
        break;
      case ModelPost:
        data = await ModelPost.findAll({
          where: {
            IsVisible: true,
          },
          group: ["Id"],
          order: [["BookingCount", "DESC"]],
          limit: 10,
          include: {
            model: ModelPost_User,
            as: "UsersLiked",
            attributes: ["UserId"],
          },
        });
        break;

      default:
        break;
    }
    (data = ImageListDestructure(
      data.map((val) => ({
        ...val.dataValues,
      }))
    )),
      res.status(200).send(data);
  });
exports.getSimilar = async (Model, id) => {
  let current = await Model.findByPk(id);
  let List;
  switch (Model) {
    case StudioPost:
      List = await Model.findAll({
        where: {
          IsVisible: true,
          Id: { [Op.ne]: id },
          Price: {
            [Op.and]: {
              [Op.gte]: current.Price - (current.Price * 15) / 100,
              [Op.lte]: current.Price + (current.Price * 15) / 100,
            },
          },
        },
        limit: 10,
        include: {
          model: StudioPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;
    case PhotographerPost:
      List = await Model.findAll({
        where: {
          IsVisible: true,
          Id: { [Op.ne]: id },
          Price: {
            [Op.and]: {
              [Op.gte]: current.Price - (current.Price * 15) / 100,
              [Op.lte]: current.Price + (current.Price * 15) / 100,
            },
          },
        },
        limit: 10,
        include: {
          model: PhotographerPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;
    case ClothesPost:
      List = await Model.findAll({
        where: {
          IsVisible: true,
          Id: { [Op.ne]: id },
          PriceByDate: {
            [Op.and]: {
              [Op.gte]: current.PriceByDate - (current.PriceByDate * 15) / 100,
              [Op.lte]: current.PriceByDate + (current.PriceByDate * 15) / 100,
            },
          },
        },
        limit: 10,
        include: {
          model: ClothesPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;
    case MakeupPost:
      List = await Model.findAll({
        where: {
          IsVisible: true,
          Id: { [Op.ne]: id },
          Price: {
            [Op.and]: {
              [Op.gte]: current.Price - (current.Price * 15) / 100,
              [Op.lte]: current.Price + (current.Price * 15) / 100,
            },
          },
        },
        limit: 10,
        include: {
          model: MakeupPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;
    case DevicePost:
      List = await Model.findAll({
        where: {
          IsVisible: true,
          Id: { [Op.ne]: id },
          Price: {
            [Op.and]: {
              [Op.gte]: current.Price - (current.Price * 15) / 100,
              [Op.lte]: current.Price + (current.Price * 15) / 100,
            },
          },
        },
        limit: 10,
        include: {
          model: DevicePost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;
    case ModelPost:
      List = await Model.findAll({
        where: {
          IsVisible: true,
          Id: { [Op.ne]: id },
          Price: {
            [Op.and]: {
              [Op.gte]: current.Price - (current.Price * 15) / 100,
              [Op.lte]: current.Price + (current.Price * 15) / 100,
            },
          },
        },
        limit: 10,
        include: {
          model: ModelPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;

    default:
      break;
  }
  List = {
    data: ImageListDestructure(
      List.map((val) => ({
        ...val.dataValues,
      }))
    ),
  };
  return List;
};

exports.getDistance = async (Model, lng, lat, id) => {
  const distance = 10; //10km
  const haversine = `(6371 * acos(cos(radians(${lat}))* cos(radians(Latitude))* cos(radians(Longtitude) - radians(${lng})) + sin(radians(${lat})) * sin(radians(Latitude))))`;
  let data = await Model.findAll({
    where: {
      Id: { [Op.ne]: id },
    },
    attributes: {
      include: [[sequelize.literal(haversine), "distance"]],
    },
    having: sequelize.literal(`distance <= ${distance}`),
    order: sequelize.col("distance"),
    limit: 10,
  });
  data = ImageListDestructure(data.map((item) => item.dataValues));
  return data;
};

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

exports.creatRatingBookingStudio = async (
  ModelBooking,
  ModelRating,
  ModelRoom,
  ModelPost,
  req
) => {
  let { Description, image, IsAnonymous, Rate } = req.body;
  let { id } = req.params;
  const user = req?.user?.id;
  // let { Description, image, IsAnonymous, Rate, id, user } = data1;
  const booking = await ModelBooking.findOne({
    where: {
      Id: id,
      BookingStatus: { [Op.eq]: 1 },
      BookingUserId: user,
    },
  });
  console.log(Description, image, IsAnonymous, Rate, id, user);

  if (!booking) {
    throw new ApiError(400, "Trang thái thanh toán chưa sẵn sàng");
  }
  const exist = await ModelRating.findOne({
    where: {
      StudioBookingId: id,
      BookingUserId: user,
    },
  });

  if (exist) {
    throw new ApiError(400, "Đã đánh giá");
  }

  const { StudioPostId } = await ModelRoom.findOne({
    where: { Id: booking.dataValues.StudioRoomId },
  });

  if (image !== undefined) {
    image = image.split(",");
  }
  let listImage = [];
  await Promise.all(
    req.files.map(async (val) => {
      let data = await AppBinaryObject.create({
        Bytes: val.buffer,
        Description: val.originalname,
      });
      listImage = [...listImage, data.dataValues.Id];
    })
  );
  let Image = listImage.reduce((acc, val, idx) => {
    const name = `Image${idx + 1}`;
    return { ...acc, [name]: val };
  }, {});

  const data = await ModelRating.create({
    BookingUserId: user,
    Rate,
    StudioPostId,
    TenantId: booking.dataValues.TenantId,
    CreationTime: moment(),
    StudioRoomId: booking.dataValues.StudioRoomId,
    Description,
    CreatorUserId: user,
    IsAnonymous,
    StudioBookingId: id,
    ...Image,
  });

  createWebHookEvents(req, { Data: data });
  createWebHookSendAttempts();
  const avg = await ModelRating.findAll({
    where: { StudioPostId },
    attributes: [[sequelize.fn("AVG", sequelize.col("Rate")), "avgRating"]],
    group: ["StudioPostId"],
  });
  const NumberOfRating = await ModelRating.count({
    where: {
      TenantId: booking.dataValues.TenantId,
    },
  });

  await ModelPost.update(
    { TotalRate: round(avg[0].dataValues.avgRating, 1), NumberOfRating },
    {
      where: {
        Id: StudioPostId,
      },
    }
  );
};

exports.creatRatingBookingPhotographer = async (
  ModelBooking,
  ModelRating,
  ModelRoom,
  ModelPost,
  req
) => {
  let { Rate, Description, image, IsAnonymous } = req.body;
  let { id } = req.params;
  const user = req?.user?.id;
  const booking = await ModelBooking.findOne({
    where: {
      Id: req.params.id,
      BookingStatus: { [Op.eq]: 1 },
      BookingUserId: user,
    },
  });
  if (!booking) {
    throw new ApiError(400, "Trang thái thanh toán chưa sẵn sàng");
  }
  const exist = await ModelRating.findOne({
    where: {
      PhotographerBookingId: id,
      BookingUserId: user,
    },
  });

  if (exist) {
    throw new ApiError(400, "Đã đánh giá");
  }

  const { PhotographerPostId } = await ModelRoom.findOne({
    where: { Id: booking.dataValues.PhotographerServicePackageId },
  });

  if (image !== undefined) {
    image = image.split(",");
  }
  let listImage = [];
  await Promise.all(
    req.files.map(async (val) => {
      let data = await AppBinaryObject.create({
        Bytes: val.buffer,
        Description: val.originalname,
      });
      listImage = [...listImage, data.dataValues.Id];
    })
  );
  let Image = listImage.reduce((acc, val, idx) => {
    const name = `Image${idx + 1}`;
    return { ...acc, [name]: val };
  }, {});

  const data = await ModelRating.create({
    BookingUserId: user,
    Rate,
    PhotographerPostId,
    TenantId: booking.dataValues.TenantId,
    PhotographerServicePackageId:
      booking.dataValues.PhotographerServicePackageId,
    CreationTime: new Date(),
    Description,
    CreatorUserId: user,
    IsAnonymous,
    PhotographerBookingId: id,
    ...Image,
  });

  createWebHookEvents(req, { Data: data });
  createWebHookSendAttempts();
  const avg = await ModelRating.findAll({
    where: { PhotographerPostId },
    attributes: [[sequelize.fn("AVG", sequelize.col("Rate")), "avgRating"]],
    group: ["PhotographerPostId"],
  });
  const NumberOfRating = await ModelRating.count({
    where: {
      PhotographerPostId,
    },
  });
  await ModelPost.update(
    { TotalRate: round(avg[0].dataValues.avgRating, 1), NumberOfRating },
    {
      where: {
        Id: PhotographerPostId,
      },
    }
  );
};

//CHỪA LẠI CHƯA LÀM =))
exports.creatRatingBookingClothes = async (
  ModelBooking,
  ModelRating,
  ModelPost,
  req
) => {
  let { Rate, Description, image, IsAnonymous } = req.body;
  let { id } = req.params;
  const user = req.user.id;
  const booking = await ModelBooking.findOne({
    where: {
      Id: req.params.id,
      BookingStatus: { [Op.eq]: 1 },
      BookingUserId: user,
    },
  });
  if (!booking) {
    throw new ApiError(400, "Trang thái thanh toán chưa sẵn sàng");
  }
  const exist = await ModelRating.findOne({
    where: {
      ClothesBookingId: id,
      BookingUserId: user,
    },
  });

  if (exist) {
    throw new ApiError(400, "Đã đánh giá");
  }

  // const { Id } = await ModelPost.findOne({
  //   where: { Id: booking.dataValues.ClothesId },
  // });

  if (image !== undefined) {
    image = image.split(",");
  }
  let listImage = [];
  await Promise.all(
    req.files.map(async (val) => {
      let data = await AppBinaryObject.create({
        Bytes: val.buffer,
        Description: val.originalname,
      });
      listImage = [...listImage, data.dataValues.Id];
    })
  );
  let Image = listImage.reduce((acc, val, idx) => {
    const name = `Image${idx + 1}`;
    return { ...acc, [name]: val };
  }, {});

  const data = await ModelRating.create({
    BookingUserId: user,
    Rate,
    ClothesPostId: booking.dataValues.ClothesId,
    TenantId: booking.dataValues.TenantId,
    CreationTime: new Date(),
    Description,
    CreatorUserId: user,
    IsAnonymous,
    ClothesBookingId: id,
    ...Image,
  });

  createWebHookEvents(req, { Data: data });
  createWebHookSendAttempts();
  const avg = await ModelRating.findAll({
    where: { ClothesPostId: booking.dataValues.ClothesId },
    attributes: [[sequelize.fn("AVG", sequelize.col("Rate")), "avgRating"]],
    group: ["ClothesPostId"],
  });

  const NumberOfRating = await ModelRating.count({
    where: {
      ClothesPostId: booking.dataValues.ClothesId,
    },
  });

  await ModelPost.update(
    { TotalRate: round(avg[0].dataValues.avgRating, 1), NumberOfRating },
    {
      where: {
        Id: booking.dataValues.ClothesId,
      },
    }
  );
};

exports.creatRatingBookingDevice = async (
  ModelBooking,
  ModelRating,
  ModelPost,
  req
) => {
  let { Rate, Description, image, IsAnonymous } = req.body;
  let { id } = req.params;
  const user = req.user.id;
  const booking = await ModelBooking.findOne({
    where: {
      Id: req.params.id,
      BookingStatus: { [Op.eq]: 1 },
      BookingUserId: user,
    },
  });
  if (!booking) {
    throw new ApiError(400, "Trang thái thanh toán chưa sẵn sàng");
  }
  const exist = await ModelRating.findOne({
    where: {
      DeviceBookingId: id,
      BookingUserId: user,
    },
  });

  if (exist) {
    throw new ApiError(400, "Đã đánh giá");
  }

  // const { Id } = await ModelPost.findOne({
  //   where: { Id: booking.dataValues.ClothesId },
  // });

  if (image !== undefined) {
    image = image.split(",");
  }
  let listImage = [];
  await Promise.all(
    req.files.map(async (val) => {
      let data = await AppBinaryObject.create({
        Bytes: val.buffer,
        Description: val.originalname,
      });
      listImage = [...listImage, data.dataValues.Id];
    })
  );
  let Image = listImage.reduce((acc, val, idx) => {
    const name = `Image${idx + 1}`;
    return { ...acc, [name]: val };
  }, {});

  const data = await ModelRating.create({
    BookingUserId: user,
    Rate,
    DevicePostId: booking.dataValues.DeviceId,
    TenantId: booking.dataValues.TenantId,
    CreationTime: new Date(),
    Description,
    CreatorUserId: user,
    IsAnonymous,
    DeviceBookingId: id,
    ...Image,
  });

  createWebHookEvents(req, { Data: data });
  createWebHookSendAttempts();
  const avg = await ModelRating.findAll({
    where: { DevicePostId: booking.dataValues.DeviceId },
    attributes: [[sequelize.fn("AVG", sequelize.col("Rate")), "avgRating"]],
    group: ["DevicePostId"],
  });

  const NumberOfRating = await ModelRating.count({
    where: {
      DevicePostId: booking.dataValues.DeviceId,
    },
  });

  await ModelPost.update(
    { TotalRate: round(avg[0].dataValues.avgRating, 1), NumberOfRating },
    {
      where: {
        Id: booking.dataValues.DeviceId,
      },
    }
  );
};

//END

exports.creatRatingBookingMakeup = async (
  ModelBooking,
  ModelRating,
  ModelRoom,
  ModelPost,
  req
) => {
  let { Rate, Description, image, IsAnonymous } = req.body;
  let { id } = req.params;

  const user = req?.user?.id;
  const booking = await ModelBooking.findOne({
    where: {
      Id: req.params.id,
      BookingStatus: { [Op.eq]: 1 },
      BookingUserId: user,
    },
  });
  if (!booking) {
    throw new ApiError(400, "Trang thái thanh toán chưa sẵn sàng");
  }
  const exist = await ModelRating.findOne({
    where: {
      MakeupBookingId: id,
      BookingUserId: user,
    },
  });

  if (exist) {
    throw new ApiError(400, "Đã đánh giá");
  }

  const { MakeupPostId } = await ModelRoom.findOne({
    where: { Id: booking.dataValues.MakeupServicePackageId },
  });

  if (image !== undefined) {
    image = image.split(",");
  }
  let listImage = [];
  await Promise.all(
    req.files.map(async (val) => {
      let data = await AppBinaryObject.create({
        Bytes: val.buffer,
        Description: val.originalname,
      });
      listImage = [...listImage, data.dataValues.Id];
    })
  );
  let Image = listImage.reduce((acc, val, idx) => {
    const name = `Image${idx + 1}`;
    return { ...acc, [name]: val };
  }, {});

  const data = await ModelRating.create({
    BookingUserId: user,
    Rate,
    MakeupPostId,
    TenantId: booking.dataValues.TenantId,
    MakeupServicePackageId: booking.dataValues.MakeupServicePackageId,
    CreationTime: new Date(),
    Description,
    CreatorUserId: user,
    IsAnonymous,
    MakeupBookingId: id,
    ...Image,
  });

  createWebHookEvents(req, { Data: data });
  createWebHookSendAttempts();
  const avg = await ModelRating.findAll({
    where: { MakeupPostId },
    attributes: [[sequelize.fn("AVG", sequelize.col("Rate")), "avgRating"]],
    group: ["MakeupPostId"],
  });

  const NumberOfRating = await ModelRating.count({
    where: {
      TenantId: booking.dataValues.TenantId,
    },
  });

  await ModelPost.update(
    { TotalRate: round(avg[0].dataValues.avgRating, 1), NumberOfRating },
    {
      where: {
        Id: MakeupPostId,
      },
    }
  );
};

exports.creatRatingBookingModel = async (
  ModelBooking,
  ModelRating,
  ModelRoom,
  ModelPost,
  req
) => {
  let { Rate, Description, image, IsAnonymous } = req.body;
  let { id } = req.params;

  const user = req?.user?.id;
  const booking = await ModelBooking.findOne({
    where: {
      Id: req.params.id,
      BookingStatus: { [Op.eq]: 1 },
      BookingUserId: user,
    },
  });
  if (!booking) {
    throw new ApiError(400, "Trang thái thanh toán chưa sẵn sàng");
  }
  const exist = await ModelRating.findOne({
    where: {
      ModelBookingId: id,
      BookingUserId: user,
    },
  });

  if (exist) {
    throw new ApiError(400, "Đã đánh giá");
  }

  const { ModelPostId } = await ModelRoom.findOne({
    where: { Id: booking.dataValues.ModelId },
  });

  if (image !== undefined) {
    image = image.split(",");
  }
  let listImage = [];
  await Promise.all(
    req.files.map(async (val) => {
      let data = await AppBinaryObject.create({
        Bytes: val.buffer,
        Description: val.originalname,
      });
      listImage = [...listImage, data.dataValues.Id];
    })
  );
  let Image = listImage.reduce((acc, val, idx) => {
    const name = `Image${idx + 1}`;
    return { ...acc, [name]: val };
  }, {});

  const data = await ModelRating.create({
    BookingUserId: user,
    Rate,
    ModelPostId,
    TenantId: booking.dataValues.TenantId,
    ModelServicePackageId: booking.dataValues.ModelId,
    CreationTime: new Date(),
    Description,
    CreatorUserId: user,
    IsAnonymous,
    ModelBookingId: id,
    ...Image,
  });

  createWebHookEvents(req, { Data: data });
  createWebHookSendAttempts();
  const avg = await ModelRating.findAll({
    where: { ModelPostId },
    attributes: [[sequelize.fn("AVG", sequelize.col("Rate")), "avgRating"]],
    group: ["ModelPostId"],
  });
  const NumberOfRating = await ModelRating.count({
    where: {
      TenantId: booking.dataValues.TenantId,
    },
  });
  await ModelPost.update(
    { TotalRate: round(avg[0].dataValues.avgRating, 1), NumberOfRating },
    {
      where: {
        Id: ModelPostId,
      },
    }
  );
};

//Get post id on IdentifyCode
exports.getStudioPostIdByIdentifyCode = async (IdentifyCode) => {
  switch (IdentifyCode.split("-")[0]) {
    case "OSTD":
      return await identifier(StudioBooking, IdentifyCode);
    case "OPTG": {
      return await identifier(PhotographerBooking, IdentifyCode);
    }
    case "OCLT": {
      return await identifier(ClothesBooking, IdentifyCode);
    }
    case "OMKP": {
      return await identifier(MakeUpBooking, IdentifyCode);
    }
    case "ODVC": {
      return await identifier(DeviceBooking, IdentifyCode);
    }
    case "OMDL": {
      return await identifier(ModelBooking, IdentifyCode);
    }
    default:
      return null;
  }
};
const identifier = async (ModelBooking, IdentifyCode) => {
  const serviceId = await ModelBooking.findOne({
    where: {
      IdentifyCode,
    },
    raw: true,
  });

  if (!serviceId) {
    return `${name}-"0"`;
  }
  return `${
    serviceId?.StudioRoomId ||
    serviceId?.PhotographerServicePackageId ||
    serviceId?.ModelId ||
    serviceId?.MakeupServicePackageId ||
    serviceId?.ClothesId ||
    serviceId?.DeviceId ||
    "null"
  }`;
};
