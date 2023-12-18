const { Op } = require("sequelize");
const catchAsync = require("../middlewares/async");
const {
  StudioRating,
  StudioPost,
  BookingUser,
  sequelize,
  StudioBooking,
  StudioRoom,
  PhotographerBooking,
  PhotographerRating,
  PhotographerServicePackage,
  PhotographerPost,
  MakeUpBooking,
  MakeupRating,
  MakeupServicePackage,
  MakeupPost,
  ModelBooking,
  ModelRating,
  ModelServicePackage,
  ModelPost,
  ClothesPost,
  DevicePost,
  ClothesRating,
  PostReport,
  DeviceRating,
  ClothesBooking,
} = require("../models");
const ApiError = require("../utils/ApiError");
const factory = require("./factoryController");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");
exports.getAll = catchAsync(async (req, res) => {
  let { category = 1, keyString = "" } = req.query;
  let list = [];
  let prefix = "PAR-";

  switch (+category) {
    case 1:
      list = await StudioPost.findAll({
        where: {
          Name: {
            [Op.like]: keyString ? `%${keyString}%` : "%%",
          },
        },
        include: [
          {
            model: StudioRating,
            as: "ratings",
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );
      break;
    case 2:
      list = await PhotographerPost.findAll({
        where: {
          Name: {
            [Op.like]: keyString ? `%${keyString}%` : "%",
          },
        },
        include: [
          {
            model: PhotographerRating,
            as: "ratings",
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );
      break;
    case 3:
      list = await ClothesPost.findAll({
        where: {
          Name: {
            [Op.like]: keyString ? `%${keyString}%` : "%",
          },
        },
        include: [
          {
            model: ClothesRating,
            as: "ratings",
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );
      break;
    case 4:
      list = await MakeupPost.findAll({
        where: {
          Name: {
            [Op.like]: keyString ? `%${keyString}%` : "%",
          },
        },
        include: [
          {
            model: MakeupRating,
            as: "ratings",
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );
      break;
    case 5:
      list = await DevicePost.findAll({
        where: {
          Name: {
            [Op.like]: keyString ? `%${keyString}%` : "%",
          },
        },
        include: [
          {
            model: DeviceRating,
            as: "ratings",
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );
      break;
    case 6:
      list = await ModelPost.findAll({
        where: {
          Name: {
            [Op.like]: keyString ? `%${keyString}%` : "%",
          },
        },
        include: [
          {
            model: ModelRating,
            as: "ratings",
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );
      break;

    default:
      break;
  }

  res.status(200).json({
    success: true,
    data: ImageListDestructure(
      list.map((item) => ({
        ...item.dataValues,
        IdentifyCode:
          prefix + ("0000000000" + item.dataValues.TenantId).slice(-10),
      }))
    ),
  });
});

exports.getDetailById = catchAsync(async (req, res) => {
  const { Id } = req.params;
  let { category = 1 } = req.query;
  let detail;
  let prefix = "PAR-";
  let postReport = [];
  switch (+category) {
    case 1:
      detail = await StudioPost.findOne({
        where: { Id },
        include: [
          {
            model: StudioRating,
            as: "ratings",
            include: {
              model: BookingUser,
              attributes: ["Fullname", "Image"],
            },
          },
        ],
      });
      postReport = await PostReport.findAll({
        where: { PostId: Id, Category: category },
        include: [{ model: BookingUser, attributes: ["Fullname", "Image"] }],
      });
      break;
    case 2:
      detail = await PhotographerPost.findOne({
        where: { Id },
        include: [
          {
            model: PhotographerRating,
            as: "ratings",
            include: {
              model: BookingUser,
              attributes: ["Fullname", "Image"],
            },
          },
        ],
      });
      postReport = await PostReport.findAll({
        where: { PostId: Id, Category: category },
        include: [{ model: BookingUser, attributes: ["Fullname", "Image"] }],
      });
      break;
    case 3:
      detail = await ClothesPost.findOne({
        where: { Id },
        // include: [
        //   {
        //     model: ClothesRating,
        //     as: "ratings",
        //     include: {
        //       model: BookingUser,
        //       attributes: ["Fullname", "Image"],
        //     },
        //   },
        // ],
      });
      postReport = await PostReport.findAll({
        where: { PostId: Id, Category: category },
        // include: [{ model: BookingUser, attributes: ["Fullname", "Image"] }],
      });
      break;
    case 5:
      detail = await DevicePost.findOne({
        where: { Id },
        // include: [
        //   {
        //     model: DeviceRating,
        //     as: "ratings",
        //     include: {
        //       model: BookingUser,
        //       attributes: ["Fullname", "Image"],
        //     },
        //   },
        // ],
      });
      postReport = await PostReport.findAll({
        where: { PostId: Id, Category: category },
        // include: [{ model: BookingUser, attributes: ["Fullname", "Image"] }],
      });
      break;
    case 4:
      detail = await MakeupPost.findOne({
        where: { Id },
        include: [
          {
            model: MakeupRating,
            as: "ratings",
            include: {
              model: BookingUser,
              attributes: ["Fullname", "Image"],
            },
          },
        ],
      });
      postReport = await PostReport.findAll({
        where: { PostId: Id, Category: category },
        include: [{ model: BookingUser, attributes: ["Fullname", "Image"] }],
      });
      break;
    case 6:
      detail = await ModelPost.findOne({
        where: { Id },
        include: [
          {
            model: ModelRating,
            as: "ratings",
            include: {
              model: BookingUser,
              attributes: ["Fullname", "Image"],
            },
          },
        ],
      });
      postReport = await PostReport.findAll({
        where: { PostId: Id, Category: category },
        include: [{ model: BookingUser, attributes: ["Fullname", "Image"] }],
      });
      break;

    default:
      break;
  }

  detail.dataValues.reports = postReport;

  const trueData = [
    {
      ...detail.dataValues,
      IdentifyCode:
        prefix + ("0000000000" + detail.dataValues.TenantId).slice(-10),
    },
  ];
  res.status(200).json({
    ...ImageListDestructure(trueData)[0],
    ratings: ImageListDestructure(
      detail.dataValues.ratings.map((item) => item.dataValues)
    ),
  });
});

exports.getRatingByPostId = catchAsync(async (req, res) => {
  if (req.query.rate) {
    let rate = await StudioPost.findOne({
      where: { Id: req.params.id },
      attributes: [],
      include: [
        {
          model: StudioRating,
          as: "ratings",
          where: {
            Rate: req.query.rate,
          },
          include: {
            model: BookingUser,
          },
        },
      ],
    });
    const trueData = rate?.ratings.map((val) => val.dataValues) || [];

    res
      .status(200)
      .json({ success: true, data: ImageListDestructure(trueData) });
  } else if (Boolean(req.query.des)) {
    let rate = await StudioPost.findOne({
      where: { Id: req.params.id },
      attributes: [],
      include: {
        model: StudioRating,
        as: "ratings",
        where: {
          Description: {
            [Op.regexp]: "[a-zA-Z0-9]",
          },
        },
        include: {
          model: BookingUser,
        },
      },
    });
    if (rate?.ratings == null) throw new ApiError(404, "NOT FOUND!!");
    const trueData = rate?.ratings.map((val) => val.dataValues);

    res
      .status(200)
      .json({ success: true, data: ImageListDestructure(trueData) });
  } else if (Boolean(req.query.image)) {
    let rate = await StudioPost.findOne({
      where: { Id: req.params.id },
      attributes: [],
      include: {
        model: StudioRating,
        as: "ratings",
        include: {
          model: BookingUser,
        },
      },
    });
    let list = [];
    rate?.ratings.map((item, idx) => {
      const image = `Image${idx + 1}`;
      const video = `Video${idx + 1}`;
      {
        item[image] || item[video] ? (list = [...list, item]) : "";
      }
    });
    if (rate?.ratings == null) throw new ApiError(404, "NOT FOUND!!");
    const trueData = list.map((val) => val.dataValues);

    res
      .status(200)
      .json({ success: true, data: ImageListDestructure(trueData) });
  } else {
    let rate = await StudioPost.findOne({
      where: { Id: req.params.id },
      attributes: [],
      include: {
        model: StudioRating,
        as: "ratings",
        include: {
          model: BookingUser,
        },
      },
    });
    const trueData = rate.ratings.map((val) => val.dataValues);

    res
      .status(200)
      .json({ success: true, data: ImageListDestructure(trueData) });
  }
});

exports.getAllRatingStudioPostId = catchAsync(async (req, res) => {
  let rate = await StudioPost.findOne({
    where: { Id: req.params.id },
    attributes: [],
    include: [
      {
        model: StudioRating,
        as: "ratings",
        where: {
          Rate: req.query.rate,
        },
        include: {
          model: BookingUser,
        },
      },
    ],
  });
  const trueData = rate?.ratings.map((val) => val.dataValues) || [];
  res.status(200).json({ success: true, data: ImageListDestructure(trueData) });
});

exports.getNumberRate = catchAsync(async (req, res) => {
  const data = await StudioRating.findAll({
    where: {
      StudioPostId: req.params.id,
    },
    attributes: [
      "Rate",
      [sequelize.fn("count", sequelize.col("Rate")), "total"],
    ],
    group: ["Rate"],
    order: [["Rate", "DESC"]],
  });
  res.status(200).send(data);
});

exports.createRatingBooking = catchAsync(async (req, res) => {
  const { category } = req.query;
  console.log(req.body);

  switch (category) {
    case "1":
      await factory.creatRatingBookingStudio(
        StudioBooking,
        StudioRating,
        StudioRoom,
        StudioPost,
        req
      );
      break;
    case "2": {
      await factory.creatRatingBookingPhotographer(
        PhotographerBooking,
        PhotographerRating,
        PhotographerServicePackage,
        PhotographerPost,
        req
      );
      break;
    }
    case "3": {
      await factory.creatRatingBookingClothes(
        ClothesBooking,
        ClothesRating,
        ClothesPost,
        req
      );
      break;
    }
    case "4": {
      await factory.creatRatingBookingMakeup(
        MakeUpBooking,
        MakeupRating,
        MakeupServicePackage,
        MakeupPost,
        req
      );
      break;
    }
    case "5": {
      await factory.creatRatingBookingDevice(
        StudioBooking,
        StudioRating,
        StudioPost,
        req
      );
      break;
    }
    case "6": {
      await factory.creatRatingBookingModel(
        ModelBooking,
        ModelRating,
        ModelServicePackage,
        ModelPost,
        req
      );
      break;
    }

    default:
      break;
  }

  // const booking = await StudioBooking.findOne({
  //   where: {
  //     Id: req.params.id,
  //     BookingStatus: { [Op.eq]: 3 },
  //     BookingUserId: user,
  //   },
  // });
  // if (!booking) {
  //   throw new ApiError(400, "Trang thái thanh toán chưa sẵn sàng");
  // }
  // const exist = await StudioRating.findOne({
  //   where: {
  //     StudioBookingId: id,
  //     BookingUserId: user,
  //   },
  // });

  // if (exist) {
  //   throw new ApiError(400, "Đã đánh giá");
  // }

  // const { StudioPostId } = await StudioRoom.findOne({
  //   where: { Id: booking.dataValues.StudioRoomId },
  // });

  // if (image !== undefined) {
  //   image = image.split(",");
  // }
  // let listImage = [];
  // await Promise.all(
  //   req.files.map(async (val) => {
  //     let data = await AppBinaryObject.create({
  //       Bytes: val.buffer,
  //       Description: val.originalname,
  //     });
  //     listImage = [...listImage, data.dataValues.Id];
  //   })
  // );
  // let Image = listImage.reduce((acc, val, idx) => {
  //   const name = `Image${idx + 1}`;
  //   return { ...acc, [name]: val };
  // }, {});

  // const data = await StudioRating.create({
  //   BookingUserId: user,
  //   Rate,
  //   StudioPostId,
  //   TenantId: booking.dataValues.TenantId,
  //   CreationTime: new Date(),
  //   StudioRoomId: booking.dataValues.StudioRoomId,
  //   Description,
  //   CreatorUserId: user,
  //   IsAnonymous,
  //   StudioBookingId: id,
  //   ...Image,
  // });
  // const avg = await StudioRating.findAll({
  //   where: { StudioPostId },
  //   attributes: [[sequelize.fn("AVG", sequelize.col("Rate")), "avgRating"]],
  //   group: ["StudioPostId"],
  // });
  // function round(value, precision) {
  //   var multiplier = Math.pow(10, precision || 0);
  //   return Math.round(value * multiplier) / multiplier;
  // }
  // await StudioPost.update(
  //   { TotalRate: round(avg[0].dataValues.avgRating, 1) },
  //   {
  //     where: {
  //       Id: StudioPostId,
  //     },
  //   }
  // );
  res.status(200).json("Success");
});

exports.getAllByPartner = catchAsync(async (req, res) => {
  let { category = 1, keyString = "" } = req.query;
  const userId = req.user.id;
  let list = [];
  let services = [];

  switch (+category) {
    case 1:
      list = await StudioPost.findAll({
        where: {
          TenantId: userId,
        },
        include: [
          {
            model: StudioRating,
            as: "ratings",
            include: {
              model: BookingUser,
              attributes: ["Fullname"],
            },
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );
      services = await StudioRoom.findAll({
        where: {
          TenantId: userId,
        },
      });
      break;
    case 2:
      list = await PhotographerPost.findAll({
        where: {
          TenantId: userId,
        },
        include: [
          {
            model: PhotographerRating,
            as: "ratings",
            include: {
              model: BookingUser,
              attributes: ["Fullname"],
            },
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );
      services = await PhotographerServicePackage.findAll({
        where: {
          TenantId: userId,
        },
      });
      break;
    case 3:
      list = await ClothesPost.findAll({
        where: {
          Name: {
            [Op.like]: keyString ? `%${keyString}%` : "%",
          },
          TenantId: userId,
        },
        include: [
          {
            model: ClothesRating,
            as: "ratings",
            include: {
              model: BookingUser,
              attributes: ["Fullname"],
            },
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );
      break;
    case 4:
      list = await MakeupPost.findAll({
        where: {
          Name: {
            [Op.like]: keyString ? `%${keyString}%` : "%",
          },
          TenantId: userId,
        },
        include: [
          {
            model: MakeupRating,
            as: "ratings",
            include: {
              model: BookingUser,
              attributes: ["Fullname"],
            },
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );
      services = await MakeupServicePackage.findAll({
        where: {
          TenantId: userId,
        },
      });
      break;
    case 5:
      list = await DevicePost.findAll({
        where: {
          Name: {
            [Op.like]: keyString ? `%${keyString}%` : "%",
          },
          TenantId: userId,
        },
        include: [
          {
            model: DeviceRating,
            as: "ratings",
            include: {
              model: BookingUser,
              attributes: ["Fullname"],
            },
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );

      break;
    case 6:
      list = await ModelPost.findAll({
        where: {
          Name: {
            [Op.like]: keyString ? `%${keyString}%` : "%",
          },
          TenantId: userId,
        },
        include: [
          {
            model: ModelRating,
            as: "ratings",
            include: {
              model: BookingUser,
              attributes: ["Fullname"],
            },
          },
        ],
      });
      list = await Promise.all(
        list.map(async (item) => {
          let rp = await PostReport.findAll({
            where: { Category: category, PostId: item.dataValues.id },
          });
          return {
            ...item,
            dataValues: { ...item.dataValues, NumberOfReport: rp.length },
          };
        })
      );
      services = await ModelServicePackage.findAll({
        where: {
          TenantId: userId,
        },
      });
      break;
    default:
      break;
  }

  res.status(200).json({
    success: true,
    data: list.map((item) => ({
      ...item.dataValues,
      ratings: ImageListDestructure(
        item.dataValues?.ratings.map((val) => val.dataValues)
      ),
      services,
    }))[0],
  });
});

exports.replyComments = catchAsync(async (req, res) => {
  let { category = 1, id, ReplyComment } = req.body;
  switch (+category) {
    case 1:
      await StudioRating.update(
        {
          ReplyComment,
        },
        {
          where: {
            id,
          },
        }
      );
      break;
    case 2:
      await PhotographerRating.update(
        {
          ReplyComment,
        },
        {
          where: {
            id,
          },
        }
      );
      break;
    case 3:
      await ClothesRating.update(
        {
          ReplyComment,
        },
        {
          where: {
            id,
          },
        }
      );
      break;
    case 4:
      await ModelRating.update(
        {
          ReplyComment,
        },
        {
          where: {
            id,
          },
        }
      );
      break;
    case 5:
      await DeviceRating.update(
        {
          ReplyComment,
        },
        {
          where: {
            id,
          },
        }
      );
      break;
    case 6:
      await ModelRating.update(
        {
          ReplyComment,
        },
        {
          where: {
            id,
          },
        }
      );
      break;
    default:
      break;
  }
  res.status(200).json({
    success: true,
  });
});
