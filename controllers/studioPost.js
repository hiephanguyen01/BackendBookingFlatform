const {
  StudioPost,
  StudioRating,
  PhotographerPost,
  DevicePost,
  ClothesPost,
  MakeupPost,
  ModelPost,
  StudioRoom,
  PhotographerServicePackage,
  DeviceShop,
  ClothesGroup,
  MakeupServicePackage,
  ModelServicePackage,
  ScheduleAndPriceStudioByDate,
  PhotographerAlbum,
  PhotographerRating,
  MakeupAlbum,
  Shop,
  BookingUser,
  StudioPost_User,
  PhotographerPost_User,
  ClothesPost_User,
  MakeupPost_User,
  ModelPost_User,
  DevicePost_User,
  MakeupRating,
  ModelRating,
  StudioBooking,
  ModelBooking,
  PhotographerBooking,
  MakeUpBooking,
  NotificationPost,
  ModelAlbum,
  ClothesBooking,
  ClothesRating,
  DeviceRating,
  AppBinaryObject,
  DeviceBooking,
} = require("../models");
const catchAsync = require("../middlewares/async");
const { Op, BOOLEAN } = require("sequelize");
const moment = require("moment");
const { createWebHook } = require("../utils/WebHook");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");

const ApiError = require("../utils/ApiError");
const baseController = require("../utils/BaseController");
const factory = require("./factoryController");
const {
  createWebHookEvents,
  createWebHookSendAttempts,
} = require("./adminWebhook");
const md5 = require("md5");
const { log } = require("winston");
const { convertTimeUTC } = require("../utils/convert");

exports.updatePostPartner = catchAsync(async (req, res) => {
  const partnerId = req.user.id;
  let { files } = req;
  let outputObject = {};
  const outputArray = Object.values(files).flat();
  console.log(outputArray);
  if (outputArray.length > 0) {
    let listImage = await Promise.all(
      outputArray.map(async (item) => {
        const image = await AppBinaryObject.create({
          Bytes: item.buffer,
          description: `${item.fieldname}${item.originalname}`,
        });
        console.log(image.dataValues.Id);
        return { [item.fieldname]: image.dataValues.Id };
      })
    );
    outputObject = listImage.reduce((acc, obj) => {
      const key = Object.keys(obj)[0];
      const value = obj[key];
      acc[key] = value;
      return acc;
    }, {});
  }
  console.log(outputObject);
  let dataBody = Object.fromEntries(
    Object.entries(req.body).filter(([key, value]) => value != "null")
  );

  switch (req.query.category) {
    case "studio":
      await StudioPost.update(
        { ...dataBody, ...outputObject },
        { where: { TenantId: partnerId } }
      );
      break;
    case "photographer":
      await PhotographerPost.update(
        { ...dataBody, ...outputObject },
        { where: { TenantId: partnerId } }
      );
      break;
    case "makeup":
      await MakeupPost.update(
        { ...dataBody, ...outputObject },
        { where: { TenantId: partnerId } }
      );
      break;
    case "model":
      await ModelPost.update(
        { ...dataBody, ...outputObject },
        { where: { TenantId: partnerId } }
      );
      break;
    case 4:
      await MakeupPost.update();
      break;
    case 6:
      await ModelPost.update();
      break;
    default:
      break;
  }
  res.status(200).json({
    success: true,
  });
});
exports.getPostPartnerId = catchAsync(async (req, res) => {
  const { category } = req.query;

  let data;
  switch (category) {
    case "studio": {
      data = await StudioPost.findOne({ where: { Id: req.params.id } });
      break;
    }
    case "photographer": {
      data = await PhotographerPost.findOne({ where: { Id: req.params.id } });
      break;
    }
    case "makeup": {
      data = await MakeupPost.findOne({ where: { Id: req.params.id } });
      break;
    }
    case "model": {
      data = await ModelPost.findOne({ where: { Id: req.params.id } });
      break;
    }
    default:
      break;
  }
  res.status(200).json({
    success: true,
    data,
  });
});
exports.getAllPostPartner = catchAsync(async (req, res) => {
  const idPartner = req.user.id;
  console.log(idPartner)
  const listPost = [];
  let studio = await StudioPost.findOne({
    where: { tenantId: idPartner },
    attributes: ["Image1", "Name", "TotalRate", "Id", "IsVisible"],
  });
  if (studio) {
    listPost.push({ ...studio.dataValues, category: "studio" });
  }
  let photographer = await PhotographerPost.findOne({
    where: { tenantId: idPartner },
    attributes: ["Image1", "Name", "TotalRate", "Id", "IsVisible"],
  });
  if (photographer) {
    listPost.push({ ...photographer.dataValues, category: "photographer" });
  }
  let makeup = await MakeupPost.findOne({
    where: { tenantId: idPartner },
    attributes: ["Image1", "Name", "TotalRate", "Id", "IsVisible"],
  });
  if (makeup) {
    listPost.push({ ...makeup.dataValues, category: "makeup" });
  }
  let device = await DevicePost.findOne({
    where: { tenantId: idPartner },
    attributes: ["Image1", "Name", "TotalRate", "Id", "IsVisible"],
  });
  if (device) {
    listPost.push({ ...device.dataValues, category: "device" });
  }
  let model = await ModelPost.findOne({
    where: { tenantId: idPartner },
    attributes: ["Image1", "Name", "TotalRate", "Id", "IsVisible"],
  });
  if (model) {
    listPost.push({ ...model.dataValues, category: "model" });
  }
  let clothes = await ClothesPost.findOne({
    where: { tenantId: idPartner },
    attributes: ["Image1", "Name", "TotalRate", "Id", "IsVisible"],
  });
  if (clothes) {
    listPost.push({ ...clothes.dataValues, category: "clothes" });
  }

  res.status(200).json({
    success: true,
    data: listPost,
  });
});

exports.createStudioPost = catchAsync(async (req, res) => {
  const { category } = req.query;
  let { files } = req;
  const partnerId = req.user.id;

  switch (category) {
    case "studio": {
      const existed = await StudioPost.findOne({
        where: { TenantId: partnerId },
      });
      if (existed) {
        throw new ApiError("400", "Studio đã tồn tại!!");
      }
      break;
    }
    case "photographer": {
      const existed = await PhotographerPost.findOne({
        where: { TenantId: partnerId },
      });
      if (existed) {
        throw new ApiError("400", "Photographer đã tồn tại!!");
      }
      break;
    }
    case "makeup": {
      const existed = await MakeupPost.findOne({
        where: { TenantId: partnerId },
      });
      if (existed) {
        throw new ApiError("400", "Makeup đã tồn tại!!");
      }
      break;
    }
    case "model": {
      const existed = await ModelPost.findOne({
        where: { TenantId: partnerId },
      });
      if (existed) {
        throw new ApiError("400", "Model đã tồn tại!!");
      }
      break;
    }
    default:
      break;
  }

  const outputArray = Object.values(files).flat();
  let listImage = await Promise.all(
    outputArray.map(async (item) => {
      const image = await AppBinaryObject.create({
        Bytes: item.buffer,
        description: `${item.fieldname}${item.originalname}`,
      });
      console.log(image.dataValues.Id);
      return { [item.fieldname]: image.dataValues.Id };
    })
  );

  const outputObject = listImage.reduce((acc, obj) => {
    const key = Object.keys(obj)[0];
    const value = obj[key];
    acc[key] = value;
    return acc;
  }, {});

  let dataBody = Object.fromEntries(
    Object.entries(req.body).filter(([key, value]) => value != "null")
  );

  let create;

  switch (category) {
    case "studio": {
      create = await StudioPost.create({
        ...dataBody,
        ...outputObject,
        TenantId: partnerId,
      });
      break;
    }
    case "photographer": {
      create = await PhotographerPost.create({
        ...dataBody,
        ...outputObject,
        TenantId: partnerId,
      });
      break;
    }
    case "makeup": {
      create = await MakeupPost.create({
        ...dataBody,
        ...outputObject,
        TenantId: partnerId,
      });
      break;
    }
    case "model": {
      create = await ModelPost.create({
        ...dataBody,
        ...outputObject,
        TenantId: partnerId,
      });
      break;
    }
    default:
      break;
  }

  if (!create) {
    throw new ApiError(400, "Wrong something!");
  }
  res.status(201).json({
    success: true,
    studio: create,
  });
});

exports.getAllStudioPost = catchAsync(async (req, res) => {
  let {
    page,
    limit,
    category,
    IsVisible,
    CreationTime,
    LastModificationTime,
    Name_like,
  } = req.query;
  let condition;

  if (CreationTime) CreationTime = JSON.parse(CreationTime);

  if (LastModificationTime) {
    LastModificationTime = JSON.parse(LastModificationTime);
  }
  const regex = /(\d+)$/;

  if (Name_like !== "") {
    condition = {
      ...condition,
      [Op.or]: [
        { Name: { [Op.like]: `%${Name_like}%` } },
        {
          TenantId: {
            [Op.like]: Name_like.match(regex)
              ? parseInt(Name_like.match(regex)[1])
              : null,
          },
        },
      ],
    };
  }

  // if (IsVisible === true || IsVisible === false) {
  //   condition["IsVisible"] = IsVisible;
  // }

  if (CreationTime?.startDate || CreationTime?.endDate) {
    condition = {
      ...condition,
      CreationTime: {
        [Op.or]: [
          {
            [Op.gte]: CreationTime?.startDate
              ? moment(CreationTime.startDate).startOf("day").utc()
              : 1,
            [Op.lte]: CreationTime?.endDate
              ? moment(CreationTime.endDate).endOf("day").utc()
              : moment().utc(),
          },
        ],
      },
    };
  }

  if (LastModificationTime?.startDate || LastModificationTime?.endDate) {
    condition = {
      ...condition,
      LastModificationTime: !LastModificationTime?.startDate
        ? {
            [Op.or]: [
              {
                [Op.gte]: LastModificationTime?.startDate
                  ? moment(LastModificationTime.startDate).startOf("day").utc()
                  : 1,
                [Op.lte]: LastModificationTime?.endDate
                  ? moment(LastModificationTime.endDate).endOf("day").utc()
                  : moment().utc(),
              },
              LastModificationTime?.startDate
                ? { [Op.not]: null }
                : { [Op.eq]: null },
            ],
          }
        : {
            [Op.or]: [
              {
                [Op.gte]: LastModificationTime?.startDate
                  ? moment(LastModificationTime.startDate).startOf("day").utc()
                  : 1,
                [Op.lte]: LastModificationTime?.endDate
                  ? moment(LastModificationTime.endDate).endOf("day").utc()
                  : moment().utc(),
              },
            ],
          },
    };
  }
  condition = {
    where: {
      ...condition,
      IsVisible:
        IsVisible == "" || IsVisible == undefined
          ? { [Op.like]: "%" }
          : IsVisible == "true"
          ? true
          : false,
    },
  };
  let List;
  switch (+category) {
    case 0: {
      List = [
        ...(
          await StudioPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 1 })),
        ...(
          await PhotographerPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 2 })),
        ...(
          await ClothesPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 3 })),
        ...(
          await MakeupPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 4 })),
        ...(
          await DevicePost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 5 })),
        ...(
          await ModelPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 6 })),
      ];

      const newList = [...List].slice((page - 1) * limit, page * limit);
      res.send({
        success: true,
        pagination: {
          totalPages: Math.ceil(List.length / +limit),
          limit: +limit,
          total: List.length,
          currentPage: +page,
          hasNextPage: +page <= Math.ceil(List.length / +limit) - 1,
        },
        data: ImageListDestructure(
          newList.map((item) => ({
            ...item,
            IdentifierCode: `STD-${Math.floor(item.CreationTime)}`,
          }))
        ),
      });
    }
    case 1:
      List = await baseController.Pagination(
        StudioPost,
        page,
        limit,
        condition
      );
      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            Id: `STD-${(`0000000000` + val.dataValues.id).slice(-10)}`,
            IdentifierCode: `PAR-${(
              `0000000000` + val.dataValues.TenantId
            ).slice(-10)}`,
            // LastModificationTime: convertTimeUTC(
            //   val.dataValues.LastModificationTime,
            //   true
            // ),
          }))
        ),
      };

      break;
    case 2:
      List = await baseController.Pagination(
        PhotographerPost,
        page,
        limit,
        condition
      );
      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            Id: `PTG-${(`0000000000` + val.dataValues.id).slice(-10)}`,
            IdentifierCode: `PAR-${(
              `0000000000` + val.dataValues.TenantId
            ).slice(-10)}`,
          }))
        ),
      };
      break;
    case 5:
      List = await baseController.Pagination(
        DevicePost,
        page,
        limit,
        condition
      );
      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            Id: `DVC-${(`0000000000` + val.dataValues.id).slice(-10)}`,
            IdentifierCode: `PAR-${(
              `0000000000` + val.dataValues.TenantId
            ).slice(-10)}`,
          }))
        ),
      };
      break;
    case 3:
      List = await baseController.Pagination(
        ClothesPost,
        page,
        limit,
        condition
      );
      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            Id: `CLT-${(`0000000000` + val.dataValues.id).slice(-10)}`,
            IdentifierCode: `PAR-${(
              `0000000000` + val.dataValues.TenantId
            ).slice(-10)}`,
          }))
        ),
      };
      break;
    case 4:
      List = await baseController.Pagination(
        MakeupPost,
        page,
        limit,
        condition
      );
      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            Id: `MKP-${(`0000000000` + val.dataValues.id).slice(-10)}`,
            IdentifierCode: `PAR-${(
              `0000000000` + val.dataValues.TenantId
            ).slice(-10)}`,
          }))
        ),
      };
      break;
    case 6:
      List = await baseController.Pagination(ModelPost, page, limit, condition);
      List = {
        ...List,
        data: ImageListDestructure(
          List.data.map((val) => ({
            ...val.dataValues,
            Id: `MDL-${(`0000000000` + val.dataValues.id).slice(-10)}`,
            IdentifierCode: `PAR-${(
              `0000000000` + val.dataValues.TenantId
            ).slice(-10)}`,
          }))
        ),
      };
      break;
    case 7: {
      condition = {
        ...condition,
        order: [["BookingCount", "DESC"]],
      };

      List = [
        ...(
          await StudioPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 1 })),
        ...(
          await PhotographerPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 2 })),
        ...(
          await ClothesPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 3 })),
        ...(
          await MakeupPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 4 })),
        ...(
          await DevicePost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 5 })),
        ...(
          await ModelPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 6 })),
      ];
      List = List.sort((a, b) => b.BookingCount - a.BookingCount);
      const newList = [...List].slice((page - 1) * limit, page * limit);
      res.send({
        success: true,
        pagination: {
          totalPages: Math.ceil(List.length / +limit),
          limit: +limit,
          total: List.length,
          currentPage: +page,
          hasNextPage: +page <= Math.ceil(List.length / +limit) - 1,
        },
        data: ImageListDestructure(
          newList.map((item) => ({
            ...item,
            IdentifierCode: `STD-${Math.floor(item.CreationTime)}`,
          }))
        ),
      });
    }
    default:
      break;
  }
  res.status(200).json({
    success: true,
    ...List,
  });
});

exports.getStudioPostById = catchAsync(async (req, res) => {
  const { id, category, userId, keyString, orderOption } = req.query;

  let post,
    service = [],
    List,
    album = [],
    shop = {},
    rating = [],
    prefix;
  switch (+category) {
    case 1:
      if (userId) {
        post = await StudioPost.findOne({
          where: { Id: +id, IsVisible: true },
          include: [
            {
              model: StudioPost_User,
              as: "UsersLiked",
              where: { UserId: userId },
            },
          ],
        });
      }
      if (!post) {
        post = await StudioPost.findOne({
          where: { Id: +id, IsVisible: true },
          IsVisible: true,
        });
      }
      if (post?.dataValues) {
        service = await StudioRoom.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
            IsDeleted: false,
          },
          include: [
            {
              model: StudioBooking,
              as: "Bookings",
              attributes: [
                "OrderByTime",
                "OrderByTimeFrom",
                "OrderByTimeTo",
                "OrderByDateTo",
                "OrderByDateFrom",
              ],
              where: {
                BookingStatus: [1, 3, 4],
                [Op.or]: {
                  OrderByDateFrom: { [Op.gte]: new Date() },
                  OrderByTimeTo: { [Op.gte]: new Date() },
                },
              },
              required: false,
            },
          ],
        });
        rating = await StudioRating.findAll({
          where: {
            StudioPostId: post?.dataValues.id,
          },
          include: [{ model: BookingUser }, { model: StudioRoom }],
          order: [["CreationTime", "DESC"]],
        });
      }
      prefix = "STD-";
      break;
    case 2:
      if (userId) {
        post = await PhotographerPost.findOne({
          where: { Id: +id, IsVisible: true },
          include: [
            {
              model: PhotographerPost_User,
              as: "UsersLiked",
              where: { UserId: userId },
            },
          ],
        });
      }
      if (!post) {
        post = await PhotographerPost.findOne({
          where: { Id: +id, IsVisible: true },
        });
      }
      if (post?.dataValues) {
        service = await PhotographerServicePackage.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
            IsDeleted: false,
          },
          include: [
            {
              model: PhotographerBooking,
              as: "Bookings",
              attributes: [
                "OrderByTime",
                "OrderByTimeFrom",
                "OrderByTimeTo",
                "OrderByDateTo",
                "OrderByDateFrom",
              ],
              where: {
                BookingStatus: [1, 3, 4],
                [Op.or]: {
                  OrderByDateFrom: { [Op.gte]: new Date() },
                  OrderByTimeTo: { [Op.gte]: new Date() },
                },
              },
              required: false,
            },
          ],
        });
        album = await PhotographerAlbum.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
        });
        rating = await PhotographerRating.findAll({
          where: {
            PhotographerPostId: +id,
          },
          include: [
            { model: BookingUser },
            { model: PhotographerServicePackage },
          ],
          order: [["CreationTime", "DESC"]],
        });
        prefix = "PTG-";
      }
      break;
    case 3:
      if (userId) {
        post = await ClothesPost.findOne({
          where: { Id: +id, IsVisible: true },
          include: [
            {
              model: ClothesPost_User,
              as: "UsersLiked",
              where: { UserId: userId },
            },
            {
              model: ClothesBooking,
              as: "Bookings",
              attributes: [
                "OrderByTime",
                "OrderByTimeFrom",
                "OrderByTimeTo",
                "OrderByDateTo",
                "OrderByDateFrom",
              ],
              where: {
                BookingStatus: [1, 3, 4],
                [Op.or]: {
                  OrderByDateFrom: { [Op.gte]: new Date() },
                  OrderByTimeTo: { [Op.gte]: new Date() },
                },
              },
              required: false,
            },
          ],
        });
      }
      if (!post) {
        post = await ClothesPost.findOne({
          where: { Id: +id, IsVisible: true },
          include: [
            {
              model: ClothesBooking,
              as: "Bookings",
            },
          ],
        });
      }
      if (post?.dataValues) {
        shop = await Shop.findOne({
          where: {
            Id: post?.dataValues.ShopId,
          },
        });
        prefix = "DVC-";
      }
      break;
    case 4:
      if (userId) {
        post = await MakeupPost.findOne({
          where: { Id: +id, IsVisible: true },
          include: [
            {
              model: MakeupPost_User,
              as: "UsersLiked",
              where: { UserId: userId },
            },
          ],
        });
      }
      if (!post) {
        post = await MakeupPost.findOne({
          where: { Id: +id, IsVisible: true },
        });
      }
      if (post?.dataValues) {
        service = await MakeupServicePackage.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
          include: [
            {
              model: MakeUpBooking,
              as: "Bookings",
              attributes: [
                "OrderByTime",
                "OrderByTimeFrom",
                "OrderByTimeTo",
                "OrderByDateTo",
                "OrderByDateFrom",
              ],
              where: {
                BookingStatus: [1, 3, 4],
                OrderByDateFrom: {
                  [Op.or]: {
                    [Op.gte]: new Date(),
                    [Op.eq]: null,
                  },
                },
              },
              required: false,
            },
          ],
        });
        album = await MakeupAlbum.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
        });
        rating = await MakeupRating.findAll({
          where: {
            MakeupPostId: post?.dataValues.id,
          },
          include: [{ model: BookingUser }, { model: MakeupServicePackage }],
          order: [["CreationTime", "DESC"]],
        });
        prefix = "CLT-";
      }
      break;
    case 5:
      if (userId) {
        post = await DevicePost.findOne({
          where: { Id: +id, IsVisible: true },
          include: [
            {
              model: DevicePost_User,
              as: "UsersLiked",
              where: { UserId: userId },
            },
            {
              model: DeviceBooking,
              as: "Bookings",
              attributes: [
                "OrderByTime",
                "OrderByTimeFrom",
                "OrderByTimeTo",
                "OrderByDateTo",
                "OrderByDateFrom",
              ],
              where: {
                BookingStatus: [1, 3, 4],
                [Op.or]: {
                  OrderByDateFrom: { [Op.gte]: new Date() },
                  OrderByTimeTo: { [Op.gte]: new Date() },
                },
              },
              required: false,
            },
          ],
        });
      }
      if (!post) {
        post = await DevicePost.findOne({
          where: { Id: +id, IsVisible: true },
        });
      }
      if (post?.dataValues) {
        service = await DeviceShop.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
        });
        prefix = "MKP-";
      }
      break;
    case 6:
      if (userId) {
        post = await ModelPost.findOne({
          where: { Id: +id, IsVisible: true },
          include: [
            {
              model: ModelPost_User,
              as: "UsersLiked",
              where: { UserId: userId },
            },
          ],
        });
      }
      if (!post) {
        post = await ModelPost.findOne({
          where: { Id: +id, IsVisible: true },
        });
      }
      if (post?.dataValues) {
        service = await ModelServicePackage.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
          include: [
            {
              model: ModelBooking,
              as: "Bookings",
              attributes: [
                "OrderByTime",
                "OrderByTimeFrom",
                "OrderByTimeTo",
                "OrderByDateTo",
                "OrderByDateFrom",
              ],
              where: {
                BookingStatus: [1, 3, 4],
                OrderByDateFrom: {
                  [Op.or]: {
                    [Op.gte]: new Date(),
                    [Op.eq]: null,
                  },
                },
              },
              required: false,
            },
          ],
        });
        album = await ModelAlbum.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
        });
        rating = await ModelRating.findAll({
          where: {
            ModelPostId: post?.dataValues.id,
          },
          include: [{ model: BookingUser }, { model: ModelServicePackage }],
          order: [["CreationTime", "DESC"]],
        });
        prefix = "MDL-";
      }
      break;

    case 7: {
      if (orderOption) {
        condition = {
          ...condition,
          order: [["BookingCount", "DESC"]],
        };
      }
      List = [
        ...(
          await StudioPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 1 })),
        ...(
          await PhotographerPost.findAll({
            ...condition,
            limit: +limit,
            include: {
              model: PhotographerPost_User,
              as: "UsersLiked",
              attributes: ["UserId"],
            },
          })
        ).map((item) => ({ ...item.dataValues, category: 2 })),
        ...(
          await ClothesPost.findAll({
            ...condition,
            limit: +limit,
            include: {
              model: ClothesPost_User,
              as: "UsersLiked",
              attributes: ["UserId"],
            },
          })
        ).map((item) => ({ ...item.dataValues, category: 3 })),
        ...(
          await MakeupPost.findAll({
            ...condition,
            limit: +limit,
            include: {
              model: MakeupPost_User,
              as: "UsersLiked",
              attributes: ["UserId"],
            },
          })
        ).map((item) => ({ ...item.dataValues, category: 4 })),
        ...(
          await DevicePost.findAll({
            ...condition,
            limit: +limit,
            include: {
              model: DevicePost_User,
              as: "UsersLiked",
              attributes: ["UserId"],
            },
          })
        ).map((item) => ({ ...item.dataValues, category: 5 })),
        ...(
          await ModelPost.findAll({
            ...condition,
            limit: +limit,
            include: {
              model: ModelPost_User,
              as: "UsersLiked",
              attributes: ["UserId"],
            },
          })
        ).map((item) => ({ ...item.dataValues, category: 6 })),
      ];
    }
    default:
      break;
  }

  if (!post) throw new ApiError(404, "Not found");

  res.status(200).json({
    success: true,
    data: ImageListDestructure([
      {
        ...post?.dataValues,
        category: +category,
        IdentifierCode: prefix + ("0000000000" + post.dataValues.id).slice(-10),
        LastModificationTime: post.dataValues.LastModificationTime
          ? post.dataValues.LastModificationTime
          : post.dataValues.CreationTime,
      },
    ])[0],
    service: ImageListDestructure(service.map((ser) => ser.dataValues)),
    album:
      album.length > 0
        ? ImageListDestructure(album.map((al) => al.dataValues))
        : [],
    shop: shop,
    rating: ImageListDestructure(rating.map((r) => r.dataValues)),
  });
});
exports.getStudioPostByIdAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { category, userId, keyString, orderOption } = req.query;

  let post,
    service = [],
    List,
    album = [],
    shop = {},
    rating = [],
    prefix;
  switch (+category) {
    case 1:
      if (!post) {
        post = await StudioPost.findOne({
          where: { Id: +id },
        });
      }
      if (post?.dataValues) {
        service = await StudioRoom.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
            IsDeleted: false,
          },
          include: [
            {
              model: StudioBooking,
              as: "Bookings",
              attributes: [
                "OrderByTime",
                "OrderByTimeFrom",
                "OrderByTimeTo",
                "OrderByDateTo",
                "OrderByDateFrom",
              ],
              where: {
                BookingStatus: [1, 3, 4],
                [Op.or]: {
                  OrderByDateFrom: { [Op.gte]: new Date() },
                  OrderByTimeTo: { [Op.gte]: new Date() },
                },
              },
              required: false,
            },
          ],
        });
        rating = await StudioRating.findAll({
          where: {
            StudioPostId: post?.dataValues.id,
          },
          include: [{ model: BookingUser }, { model: StudioRoom }],
          order: [["CreationTime", "DESC"]],
        });
      }
      prefix = "STD-";
      break;
    case 2:
      if (!post) {
        post = await PhotographerPost.findOne({
          where: { Id: +id },
        });
      }
      if (post?.dataValues) {
        service = await PhotographerServicePackage.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
            IsDeleted: false,
          },
          include: [
            {
              model: PhotographerBooking,
              as: "Bookings",
              attributes: [
                "OrderByTime",
                "OrderByTimeFrom",
                "OrderByTimeTo",
                "OrderByDateTo",
                "OrderByDateFrom",
              ],
              where: {
                BookingStatus: [1, 3, 4],
                [Op.or]: {
                  OrderByDateFrom: { [Op.gte]: new Date() },
                  OrderByTimeTo: { [Op.gte]: new Date() },
                },
              },
              required: false,
            },
          ],
        });
        album = await PhotographerAlbum.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
        });
        rating = await PhotographerRating.findAll({
          where: {
            PhotographerPostId: +id,
          },
          include: [
            { model: BookingUser },
            { model: PhotographerServicePackage },
          ],
          order: [["CreationTime", "DESC"]],
        });
        prefix = "PTG-";
      }
      break;
    case 3:
      if (!post) {
        post = await ClothesPost.findOne({
          where: { Id: +id },
          include: [
            {
              model: ClothesBooking,
              as: "Bookings",
            },
          ],
        });
      }
      if (post?.dataValues) {
        prefix = "DVC-";
      }
      break;
    case 4:
      if (!post) {
        post = await MakeupPost.findOne({
          where: { Id: +id },
        });
      }
      if (post?.dataValues) {
        service = await MakeupServicePackage.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
          include: [
            {
              model: MakeUpBooking,
              as: "Bookings",
              attributes: [
                "OrderByTime",
                "OrderByTimeFrom",
                "OrderByTimeTo",
                "OrderByDateTo",
                "OrderByDateFrom",
              ],
              where: {
                BookingStatus: [1, 3, 4],
                OrderByDateFrom: {
                  [Op.or]: {
                    [Op.gte]: new Date(),
                    [Op.eq]: null,
                  },
                },
              },
              required: false,
            },
          ],
        });
        album = await MakeupAlbum.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
        });
        rating = await MakeupRating.findAll({
          where: {
            MakeupPostId: post?.dataValues.id,
          },
          include: [{ model: BookingUser }, { model: MakeupServicePackage }],
          order: [["CreationTime", "DESC"]],
        });
        prefix = "CLT-";
      }
      break;
    case 5:
      if (!post) {
        post = await DevicePost.findOne({
          where: { Id: +id },
        });
      }
      if (post?.dataValues) {
        service = await DeviceShop.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
        });
        prefix = "MKP-";
      }
      break;
    case 6:
      if (!post) {
        post = await ModelPost.findOne({
          where: { Id: +id },
        });
      }
      if (post?.dataValues) {
        service = await ModelServicePackage.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
          include: [
            {
              model: ModelBooking,
              as: "Bookings",
              attributes: [
                "OrderByTime",
                "OrderByTimeFrom",
                "OrderByTimeTo",
                "OrderByDateTo",
                "OrderByDateFrom",
              ],
              where: {
                BookingStatus: [1, 3, 4],
                OrderByDateFrom: {
                  [Op.or]: {
                    [Op.gte]: new Date(),
                    [Op.eq]: null,
                  },
                },
              },
              required: false,
            },
          ],
        });
        album = await ModelAlbum.findAll({
          where: {
            TenantId: post?.dataValues.TenantId || "",
          },
        });
        rating = await ModelRating.findAll({
          where: {
            ModelPostId: post?.dataValues.id,
          },
          include: [{ model: BookingUser }, { model: ModelServicePackage }],
          order: [["CreationTime", "DESC"]],
        });
        prefix = "MDL-";
      }
      break;

    case 7: {
      if (orderOption) {
        condition = {
          ...condition,
          order: [["BookingCount", "DESC"]],
        };
      }
      List = [
        ...(
          await StudioPost.findAll({
            ...condition,
            limit: +limit,
          })
        ).map((item) => ({ ...item.dataValues, category: 1 })),
        ...(
          await PhotographerPost.findAll({
            ...condition,
            limit: +limit,
            include: {
              model: PhotographerPost_User,
              as: "UsersLiked",
              attributes: ["UserId"],
            },
          })
        ).map((item) => ({ ...item.dataValues, category: 2 })),
        ...(
          await ClothesPost.findAll({
            ...condition,
            limit: +limit,
            include: {
              model: ClothesPost_User,
              as: "UsersLiked",
              attributes: ["UserId"],
            },
          })
        ).map((item) => ({ ...item.dataValues, category: 3 })),
        ...(
          await MakeupPost.findAll({
            ...condition,
            limit: +limit,
            include: {
              model: MakeupPost_User,
              as: "UsersLiked",
              attributes: ["UserId"],
            },
          })
        ).map((item) => ({ ...item.dataValues, category: 4 })),
        ...(
          await DevicePost.findAll({
            ...condition,
            limit: +limit,
            include: {
              model: DevicePost_User,
              as: "UsersLiked",
              attributes: ["UserId"],
            },
          })
        ).map((item) => ({ ...item.dataValues, category: 5 })),
        ...(
          await ModelPost.findAll({
            ...condition,
            limit: +limit,
            include: {
              model: ModelPost_User,
              as: "UsersLiked",
              attributes: ["UserId"],
            },
          })
        ).map((item) => ({ ...item.dataValues, category: 6 })),
      ];
    }
    default:
      break;
  }

  if (!post) throw new ApiError(404, "Not found");

  res.status(200).json({
    success: true,
    data: ImageListDestructure([
      {
        ...post?.dataValues,
        category: +category,
        IdentifierCode: prefix + ("0000000000" + post.dataValues.id).slice(-10),
        LastModificationTime: post.dataValues.LastModificationTime
          ? post.dataValues.LastModificationTime
          : post.dataValues.CreationTime,
      },
    ])[0],
    service: ImageListDestructure(service.map((ser) => ser.dataValues)),
    album:
      album.length > 0
        ? ImageListDestructure(album.map((al) => al.dataValues))
        : [],

    rating: ImageListDestructure(rating.map((r) => r.dataValues)),
  });
});

exports.deleteStudioPostById = catchAsync(async (req, res) => {
  const { id, category } = req.query;
  switch (+category) {
    case 1:
      await StudioPost.destroy({ where: { id: +id } });
      break;
    case 2:
      await PhotographerPost.destroy({ where: { id: +id } });
      break;
    case 5:
      await DevicePost.destroy({ where: { id: +id } });
      break;
    case 3:
      await ClothesPost.destroy({ where: { id: +id } });
      break;
    case 4:
      await MakeupPost.destroy({ where: { id: +id } });
      break;
    case 6:
      await ModelPost.destroy({ where: { id: +id } });
      break;
    default:
      break;
  }
  res.status(200).json({
    success: true,
  });
});

exports.updateStudioPostById = catchAsync(async (req, res) => {
  const { id, category, IsVisible, Note = "" } = req.query;
  switch (+category) {
    case 1:
      await StudioPost.update(
        { IsVisible, Note, LastModificationTime: Date.now() },
        { where: { id: +id } }
      );
      break;
    case 2:
      await PhotographerPost.update(
        { IsVisible, Note, LastModificationTime: Date.now() },
        { where: { id: +id } }
      );
      break;
    case 5:
      await DevicePost.update(
        { IsVisible, Note, LastModificationTime: Date.now() },
        { where: { id: +id } }
      );
      break;
    case 3:
      await ClothesPost.update(
        { IsVisible, Note, LastModificationTime: Date.now() },
        { where: { id: +id } }
      );
      break;
    case 4:
      await MakeupPost.update(
        { IsVisible, Note, LastModificationTime: Date.now() },
        { where: { id: +id } }
      );
      break;
    case 6:
      await ModelPost.update(
        { IsVisible, Note, LastModificationTime: Date.now() },
        { where: { id: +id } }
      );
      break;
    default:
      break;
  }
  res.status(200).json({
    success: true,
  });
});
exports.getTop10OrderStudioPost = factory.getTop10Oder(StudioPost);

exports.getSimilar = catchAsync(async (req, res) => {
  const { category } = req.query;
  const { id } = req.params;
  let List = [];
  switch (+category) {
    case 1:
      List = await factory.getSimilar(StudioPost, id);
      break;
    case 2:
      List = await factory.getSimilar(PhotographerPost, id);
      break;
    case 5:
      List = await factory.getSimilar(DevicePost, id);
      break;
    case 3:
      List = await factory.getSimilar(ClothesPost, id);
      break;
    case 4:
      List = await factory.getSimilar(MakeupPost, id);
      break;
    case 6:
      List = await factory.getSimilar(ModelPost, id);
  }
  res.status(200).json({
    success: true,
    ...List,
  });
});
exports.getStudioPostByTenantId = catchAsync(async (req, res) => {
  let { TenantId, category } = req.query;
  TenantId = +TenantId;
  let post;
  const condition = {
    where: {
      TenantId: TenantId,
    },
    attributes: ["id", "TenantId", "Name"],
  };
  switch (+category) {
    case 1:
      post = await StudioPost.findOne(condition);
      break;
    case 2:
      post = await PhotographerPost.findOne(condition);
      break;
    case 3:
      post = await ClothesPost.findOne(condition);
      break;
    case 4:
      post = await MakeupPost.findOne(condition);
      break;
    case 5:
      post = await DevicePost.findOne(condition);
      break;
    case 6:
      post = await ModelPost.findOne(condition);
      break;
    default:
      break;
  }
  if (!post) throw new ApiError(404, "Not found");
  res.status(200).json({
    success: true,
    data: post,
  });
});

exports.getDistance123 = catchAsync(async (req, res) => {
  const { lat, lng } = req.query;
  const { id } = req.params;
  data = await factory.getDistance(StudioPost, lng, lat, id);
  res.status(200).send(data);
});

exports.filterRelatedServices = catchAsync(async (req, res) => {
  let { hasTags, search } = req.query;
  if (!hasTags) throw new ApiError(404, "HasTags not null");
  hasTags = hasTags.split(",");
  let service = hasTags.reduce(async (arr, item) => {
    let temp = [];
    switch (item) {
      case "studio":
        const studioService = await StudioPost.findAll({
          where: {
            Name: { [Op.like]: search ? `%${search}%` : `%%` },
            IsVisible: true,
          },
        });
        temp = [
          ...studioService.map((itm) => ({ ...itm.dataValues, category: 1 })),
        ];
        break;
      case "nhiepanh":
        const photographerService = await PhotographerPost.findAll({
          where: {
            Name: { [Op.like]: search ? `%${search}%` : `%%` },
            IsVisible: true,
          },
        });
        temp = [
          ...photographerService.map((itm) => ({
            ...itm.dataValues,
            category: 2,
          })),
        ];
        break;
      case "trangphuc":
        const clothesService = await ClothesPost.findAll({
          where: {
            Name: { [Op.like]: search ? `%${search}%` : `%%` },
            IsVisible: true,
          },
        });
        temp = [
          ...clothesService.map((itm) => ({ ...itm.dataValues, category: 3 })),
        ];
        break;
      case "makeup":
        const makeupService = await MakeupPost.findAll({
          where: {
            Name: { [Op.like]: search ? `%${search}%` : `%%` },
            IsVisible: true,
          },
        });
        temp = [
          ...makeupService.map((itm) => ({ ...itm.dataValues, category: 4 })),
        ];
        break;
      case "nguoimau":
        const modelService = await ModelPost.findAll({
          where: {
            Name: { [Op.like]: search ? `%${search}%` : `%%` },
            IsVisible: true,
          },
        });
        temp = [
          ...modelService.map((itm) => ({ ...itm.dataValues, category: 6 })),
        ];
        break;
      case "thietbi":
        const deviceService = await DevicePost.findAll({
          where: {
            Name: { [Op.like]: search ? `%${search}%` : `%%` },
            IsVisible: true,
          },
        });
        temp = [
          ...deviceService.map((itm) => ({ ...itm.dataValues, category: 5 })),
        ];
        break;
      default:
        break;
    }
    return [...(await arr), ...temp];
  }, []);
  res.status(200).json({
    success: true,
    data: ImageListDestructure(await service),
  });
});

exports.getRatingExisted = catchAsync(async (req, res) => {
  let { category } = req.query;
  let post = [];
  let user = req.user.id;
  const post1 = await StudioRating.findAll({
    where: {
      BookingUserId: user,
    },
    attributes: ["StudioBookingId", "Id"],
  });
  const post2 = await PhotographerRating.findAll({
    where: {
      BookingUserId: user,
    },
    attributes: ["PhotographerBookingId", "Id"],
  });
  const post3 = await ClothesRating.findAll({
    where: {
      BookingUserId: user,
    },
    attributes: ["ClothesBookingId", "Id"],
  });
  const post4 = await MakeupRating.findAll({
    where: {
      BookingUserId: user,
    },
    attributes: ["MakeupBookingId", "Id"],
  });
  const post5 = await DeviceRating.findAll({
    where: {
      BookingUserId: user,
    },
    attributes: ["DeviceBookingId", "Id"],
  });
  const post6 = await ModelRating.findAll({
    where: {
      BookingUserId: user,
    },
    attributes: ["ModelBookingId", "Id"],
  });
  post = [
    ...post1.map((item) => ({ ...item.dataValues, category: 1 })),
    ...post2.map((item) => ({ ...item.dataValues, category: 2 })),
    ...post3.map((item) => ({ ...item.dataValues, category: 3 })),
    ...post4.map((item) => ({ ...item.dataValues, category: 4 })),
    ...post5.map((item) => ({ ...item.dataValues, category: 5 })),
    ...post6.map((item) => ({ ...item.dataValues, category: 6 })),
  ];

  if (!post) throw new ApiError(404, "Not found");
  res.status(200).json({
    success: true,
    data: post,
  });
});

exports.toggleNotificationDao = catchAsync(async (req, res) => {
  const object = baseController.filterObj(req.body, "PostId");
  let user = req.user.id;
  const existed = await NotificationPost.findOne({
    where: { PostId: req.body.PostId, UserId: user },
  });
  if (existed) {
    await NotificationPost.destroy({ where: { Id: existed?.dataValues.id } });
    return res.status(200).json({
      success: true,
      data: "Turn off notification Dao",
    });
  }
  const data = await NotificationPost.create({ ...object, UserId: user });

  createWebHookEvents(req, { Data: data });
  createWebHookSendAttempts();

  res.status(200).json({
    success: true,
    data: data,
  });
});

exports.getAllNotificationDao = catchAsync(async (req, res) => {
  let user = req.user.id;
  const data = await NotificationPost.findAll({ where: { UserId: user } });

  res.status(200).json({
    success: true,
    data: data,
  });
});

exports.getAllCalendarAndPrice = catchAsync(async (req, res) => {
  const { room, tenantId, category } = req.query;
  let post, list;
  switch (category) {
    case "studio":
      post = await StudioPost.findOne({ where: { TenantId: tenantId } });
      list = await ScheduleAndPriceStudioByDate.findAll({
        where: {
          RoomId: room,
          TenantId: tenantId,
        },
      });
      break;

    default:
      break;
  }

  res.status(200).json({ Post: post, scheduleAndPrices: list });
});

exports.getAllPostAff = catchAsync(async (req, res) => {
  const { page, limit, category, search = "" } = req.query;
  let options = {
    [Op.or]: [
      {
        Name: {
          [Op.like]: search !== "" ? `%${search}%` : "%%",
        },
      },
    ],
  };
  let condition = {
    where: options,
    order: [["CreationTime", "DESC"]],
  };
  const option = {
    1: await baseController.Pagination(StudioPost, page, limit, condition),
    2: await baseController.Pagination(
      PhotographerPost,
      page,
      limit,
      condition
    ),
    4: await baseController.Pagination(MakeupPost, page, limit, condition),
    6: await baseController.Pagination(ModelPost, page, limit, condition),
  };

  const data = await option[category];

  res.status(200).send(data);
});
