const { Banner } = require("../models");
const { AppBinaryObject } = require("../models");

const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const { Op, where } = require("sequelize");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");

exports.getAllBanner = catchAsync(async (req, res) => {
  const list = await Banner.findAll({ order: [["Priority", "ASC"]] });
  res.status(200).json({
    success: true,
    data: ImageListDestructure(list.map((item) => item.dataValues)),
  });
});

exports.getBannerById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findByPk(id);
  if (!banner) {
    throw new ApiError(404, "banner not found");
  }
  res.status(200).json({
    success: true,
    data: banner,
  });
});

exports.createBanner = catchAsync(async (req, res) => {
  const { Name, Description, Creator, IsVisible } = req.body;

  const images = req.files;

  const imgs = (
    await Promise.all(
      images.map(
        async (item) =>
          await AppBinaryObject.create({
            Bytes: item.buffer,
            description: item.originalname,
          })
      )
    )
  ).map((item) => item.dataValues.Id);

  const PriorityIndex = (
    await Banner.findOne({
      order: [["Priority", "DESC"]],
    })
  ).dataValues.Priority;

  await Banner.create({
    Name,
    Description,
    Creator,
    ...imgs.reduce(
      (obj, item, index) => ({ ...obj, ["Image" + (index + 1)]: item }),
      {}
    ),
    IsVisible,
    Priority: PriorityIndex + 1,
  });
  res.status(200).json({
    success: true,
    // data: list,
  });
});

exports.updateBanner = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { increase } = req.query;

  const { Name, Description, Creator, IsVisible, Image = "" } = req.body;
  const banner = await Banner.findByPk(id);
  if (!banner) {
    throw new ApiError(404, "banner not found");
  }

  const bannerImages = [banner.dataValues.Image1, banner.dataValues.Image2];

  const updateBannerImages =
    typeof Image === "string"
      ? bannerImages.filter((item) => item !== Image)
      : [];

  if (req.files.length > 0) {
    await Promise.all(
      updateBannerImages.map(
        async (item, index) =>
          await AppBinaryObject.update(
            {
              Bytes: req?.files[index]?.buffer,
            },
            {
              where: {
                id: item,
              },
            }
          )
      )
    );
  } else {
    const newImage = Image.filter((item) => item);
    if (newImage.length < 2) {
      const imageDestroy = bannerImages.filter((item) => !Image.includes(item));
      await AppBinaryObject.destroy({
        where: { Id: { [Op.in]: imageDestroy } },
      });
      await Banner.update(
        { Image1: "" },
        { where: { Image1: { [Op.in]: imageDestroy } } }
      );
      await Banner.update(
        { Image2: "" },
        { where: { Image2: { [Op.in]: imageDestroy } } }
      );
    }
  }
  if (increase === undefined) {
    await Banner.update(
      { Name, Description, Creator, IsVisible },
      {
        where: {
          id,
        },
      }
    );
  } else {
    await Banner.update(
      {
        Priority: banner?.dataValues?.Priority,
      },
      {
        where: {
          Priority: +increase
            ? banner?.dataValues?.Priority - 1
            : banner?.dataValues?.Priority + 1,
        },
      }
    );
    await Banner.update(
      {
        Priority: +increase
          ? banner?.dataValues?.Priority - 1
          : banner?.dataValues?.Priority + 1,
      },
      {
        where: {
          id,
        },
      }
    );
  }

  const newBanner = await Banner.findByPk(id);
  res.status(200).json({
    success: true,
    message: "update success",
    data: newBanner,
  });
});
exports.deleteBanner = catchAsync(async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findByPk(id);
  if (!banner) {
    throw new ApiError(404, "banner not found");
  }
  await Banner.destroy({
    where: {
      id,
    },
  });
  await AppBinaryObject.destroy({
    where: {
      id: String(banner.dataValues.Image),
    },
  });
  const banners = await Banner.findAll({
    where: { Priority: { [Op.gt]: banner.dataValues.Priority } },
  });

  await Promise.all(
    banners.map(async (item) =>
      Banner.increment({ Priority: -1 }, { where: { id: item.dataValues.id } })
    )
  );
  res.status(200).json({
    success: true,
    message: "delete success",
  });
});
