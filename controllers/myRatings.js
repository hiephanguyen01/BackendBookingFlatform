const {
  StudioRating,
  PhotographerRating,
  DeviceRating,
  DevicePost,
  ModelRating,
  ClothesRating,
  ClothesPost,
  MakeupRating,
  StudioRoom,
  PhotographerServicePackage,
  ModelServicePackage,
  MakeupServicePackage,
  BookingUser,
  StudioPost,
  PhotographerPost,
  ModelPost,
  MakeupPost,
} = require("../models");
const catchAsync = require("../middlewares/async");
const moment = require("moment");
const { createWebHook } = require("../utils/WebHook");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");

exports.getAllMyRatings = catchAsync(async (req, res) => {
  const id = req.user.id;
  let newDataStudio = [];
  let newDataPhoto = [];
  let newDataDevice = [];
  let newDataClothe = [];
  let newDataModel = [];
  let newDataMakeup = [];
  studio = await StudioRating.findAll({
    where: {
      BookingUserId: id,
    },
    include: [
      {
        model: StudioRoom,
        include: [{ model: StudioPost, as: "StudioPost" }],
      },
      {
        model: BookingUser,
      },
    ],
  });
  newDataStudio = await ImageListDestructure(
    studio.map((itm) => ({
      ...itm.dataValues,
      Item: itm.StudioRoom,
      StudioRoom: null,
    }))
  );

  photographer = await PhotographerRating.findAll({
    where: {
      BookingUserId: id,
    },
    include: [
      {
        model: PhotographerServicePackage,
        include: [{ model: PhotographerPost, as: "PhotographerPost" }],
      },
      {
        model: BookingUser,
      },
    ],
  });

  newDataPhoto = await ImageListDestructure(
    photographer.map((itm) => ({
      ...itm.dataValues,
      Item: itm.PhotographerServicePackage,
      PhotographerServicePackage: null,
    }))
  );

  device = await DeviceRating.findAll({
    where: {
      BookingUserId: id,
    },
    include: [
      {
        model: DevicePost,
      },
    ],
  });

  newDataDevice = await ImageListDestructure(
    device.map((itm) => itm.dataValues)
  );

  model = await ModelRating.findAll({
    where: {
      BookingUserId: id,
    },
    include: [
      {
        model: ModelServicePackage,
      },
      {
        model: BookingUser,
      },
    ],
  });
  newDataModel = await ImageListDestructure(
    model.map((itm) => ({
      ...itm.dataValues,
      Item: itm.ModelServicePackage,
      ModelServicePackage: null,
    }))
  );
  clothes = await ClothesRating.findAll({
    where: {
      BookingUserId: id,
    },
    include: [
      {
        model: ClothesPost,
      },
    ],
  });

  newDataClothe = await ImageListDestructure(
    clothes.map((itm) => itm.dataValues)
  );
  makeup = await MakeupRating.findAll({
    where: {
      BookingUserId: id,
    },
    include: [
      {
        model: MakeupServicePackage,
      },
      {
        model: BookingUser,
      },
    ],
  });

  newDataMakeup = await ImageListDestructure(
    makeup.map((itm) => ({
      ...itm.dataValues,
      Item: itm.MakeupServicePackage,
      MakeupServicePackage: null,
    }))
  );
  let data = [
    ...newDataStudio,
    ...newDataPhoto,
    ...newDataDevice,
    ...newDataModel,
    ...newDataClothe,
    ...newDataMakeup,
  ];

  data = data.sort((a, b) => b.CreationTime - a.CreationTime);
  res.status(200).json(data);
});
