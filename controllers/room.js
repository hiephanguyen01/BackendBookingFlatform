const {
  StudioRoom,
  PhotographerServicePackage,
  MakeupServicePackage,
  ModelServicePackage,
  StudioPost,
  PhotographerPost,
  MakeupPost,
  ModelPost,
  AppBinaryObject,
} = require("../models");
const catchAsync = require("../middlewares/async");
const moment = require("moment");
const { createWebHook } = require("../utils/WebHook");
const baseController = require("../utils/BaseController");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");
const { Op } = require("sequelize");
const { getDistance } = require("./factoryController");
const ApiError = require("../utils/ApiError");
// const { Sequelize } = require("sequelize");

exports.getAllRoomByPartnerId = catchAsync(async (req, res) => {
  const { category } = req.query;
  const { id } = req.params;
  const partnerId = req.user.id;
  const label = {
    1: "Studio",
    2: "Photographer",
    4: "Makeup",
    6: "Model",
  };
  const post = {
    1: await StudioRoom.findAll({
      where: { TenantId: partnerId, IsDeleted: false },
    }),
    2: await PhotographerServicePackage.findAll({
      where: {
        TenantId: partnerId,
        IsDeleted: false,
        // PhotographerPostId: partnerId,
      },
    }),
    4: await MakeupServicePackage.findAll({
      where: { TenantId: partnerId, IsDeleted: false },
    }),
    6: await ModelServicePackage.findAll({
      where: { TenantId: partnerId, IsDeleted: false },
    }),
  };
  res.status(200).json({ label: label[category], post: post[category] });
});
exports.createRoom = catchAsync(async (req, res) => {
  let { files } = req;
  const { category } = req.query;
  const partnerId = req.user.id;

  let existed;
  switch (category) {
    case "studio": {
      existed = await StudioRoom.findOne({ where: { Name: req.body.Name } });

      break;
    }
    case "photographer": {
      existed = await PhotographerServicePackage.findOne({
        where: { Name: req.body.Name },
      });
      break;
    }
    case "makeup": {
      existed = await MakeupServicePackage.findOne({
        where: { Name: req.body.Name },
      });
      break;
    }
    case "model": {
      existed = await ModelServicePackage.findOne({
        where: { Name: req.body.Name },
      });
      break;
    }
    default:
      break;
  }

  if (existed) {
    throw new ApiError("400", "Studio đã tồn tại!!");
  }
  const outputArray = Object.values(files).flat();
  console.log(outputArray);
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
      create = await StudioRoom.create({
        ...dataBody,
        ...outputObject,
        TenantId: partnerId,
      });
      break;
    }
    case "photographer": {
      create = await PhotographerServicePackage.create({
        ...dataBody,
        ...outputObject,
        TenantId: partnerId,
      });
      break;
    }
    case "makeup": {
      create = await MakeupServicePackage.create({
        ...dataBody,
        ...outputObject,
        TenantId: partnerId,
      });
      break;
    }
    case "model": {
      create = await ModelServicePackage.create({
        ...dataBody,
        ...outputObject,
        TenantId: partnerId,
      });
      break;
    }
    default:
      break;
  }
  console.log(create);
  if (!create) {
    throw new ApiError(400, "Wrong something!");
  }
  res.status(201).json({
    success: true,
  });
});
exports.getAllRoom = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const list = await baseController.Pagination(StudioRoom, page, limit);
  res.status(200).send(list);
});

exports.getDetailRoom = catchAsync(async (req, res) => {
  const list = await StudioRoom.findAll({
    where: {
      StudioPostId: req.params.id,
    },
  });
  const newlist = ImageListDestructure(list.map((item) => item.dataValues));
  res.status(200).send(newlist);
});

exports.getAllService = catchAsync(async (req, res) => {
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
    1: await baseController.Pagination(StudioRoom, page, limit, condition),
    2: await baseController.Pagination(
      PhotographerServicePackage,
      page,
      limit,
      condition
    ),
    4: await baseController.Pagination(
      MakeupServicePackage,
      page,
      limit,
      condition
    ),
    6: await baseController.Pagination(
      ModelServicePackage,
      page,
      limit,
      condition
    ),
  };

  const data = await option[category];

  res.status(200).send(data);
});
exports.getDetailService = catchAsync(async (req, res) => {
  const { id, category } = req.query;
  const label = {
    1: "Studio",
    2: "Photographer",
    4: "Makeup",
    6: "Model",
  };
  const post = {
    1: await StudioPost.findByPk(id),
    2: await PhotographerPost.findByPk(id),
    4: await MakeupPost.findByPk(id),
    6: await ModelPost.findByPk(id),
  };
  res.status(200).send({ label: label[category], post: post[category] });
});
exports.getDetailServiceById = catchAsync(async (req, res) => {
  const { category } = req.query;
  const { id } = req.params;
  const label = {
    1: "Studio",
    2: "Photographer",
    4: "Makeup",
    6: "Model",
  };
  const post = {
    1: await StudioRoom.findByPk(id),
    2: await PhotographerPost.findByPk(id),
    4: await MakeupPost.findByPk(id),
    6: await ModelPost.findByPk(id),
  };
  res.status(200).send({ label: label[category], post: post[category] });
});
exports.updateService = catchAsync(async (req, res) => {
  const { id, category } = req.query;

  const option = {
    1: await StudioPost.update(
      {
        ...req.body,
      },
      {
        where: {
          id,
        },
      }
    ),
    2: await PhotographerPost.update(
      {
        ...req.body,
      },
      {
        where: {
          id,
        },
      }
    ),
    4: await MakeupPost.update(
      {
        ...req.body,
      },
      {
        where: {
          id,
        },
      }
    ),
    6: await ModelPost.update(
      {
        ...req.body,
      },
      {
        where: {
          id,
        },
      }
    ),
  };
  await option[category];

  res.status(200).send("ok");
});

exports.deleteRoom = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  await StudioRoom.update(
    {
      IsDeleted: true,
    },
    {
      where: {
        id,
      },
    }
  ),
    res.status(200).json({
      status: "success",
    });
});

exports.updateRoomPartner = catchAsync(async (req, res) => {
  const partnerId = req.user.id;
  const { id } = req.params;
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
      await StudioRoom.update(
        { ...dataBody, ...outputObject, TenantId: partnerId },
        { where: { id: id } }
      );
      break;
    case 2:
      await PhotographerPost.update();
      break;
    case 5:
      await DevicePost.update();
      break;
    case 3:
      await ClothesPost.update();
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
