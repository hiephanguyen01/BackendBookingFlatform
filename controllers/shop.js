const {
  Shop,
  ClothesPost,
  DevicePost,
  DeviceShop,
  GroupMap,
  ClothesGroup,
} = require("../models");
const catchAsync = require("../middlewares/async");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");
// const { Sequelize } = require("sequelize");

exports.getShopDetail = catchAsync(async (req, res) => {
  const { category } = req.query;
  const { id } = req.params;
  let shop = {};
  switch (+category) {
    case 3:
      shop = await Shop.findOne({
        where: { id },
        attributes: ["id", "Name", "Address", "Description"],
        include: [
          {
            model: ClothesPost,
            attributes: [
              "id",
              "Name",
              "Address",
              "TotalRate",
              "NumberOfRating",
              "BookingCount",
              "Image1",
              "Image2",
              "Image3",
              "Image4",
              "Image5",
              "Image6",
              "Image7",
              "Image8",
              "Image9",
              "Image10",
              "Image11",
              "Image12",
              "Image13",
              "Image14",
              "Image15",
              "Image16",
              "Image17",
              "Image18",
              "Image19",
              "Image20",
            ],
          },
          {
            model: ClothesGroup,
            attributes: ["id", "Name", "Image"],
            include: {
              model: GroupMap,
              attributes: ["id", "TenantId", "ClothesGroupId", "ClothesPostId"],
              include: {
                model: ClothesPost,
                attributes: [
                  "id",
                  "Name",
                  "Address",
                  "TotalRate",
                  "NumberOfRating",
                  "BookingCount",
                  "Image1",
                  "Image2",
                  "Image3",
                  "Image4",
                  "Image5",
                  "Image6",
                  "Image7",
                  "Image8",
                  "Image9",
                  "Image10",
                  "Image11",
                  "Image12",
                  "Image13",
                  "Image14",
                  "Image15",
                  "Image16",
                  "Image17",
                  "Image18",
                  "Image19",
                  "Image20",
                ],
              },
            },
          },
        ],
      });
      break;
    case 5:
      break;

    default:
      break;
  }

  const shopPost = ImageListDestructure(
    shop?.ClothesPosts.map((item) => item.dataValues)
  );

  let groups = shop?.ClothesGroups.map((item) => ({
    ...item.dataValues,
    GroupMaps: item.dataValues.GroupMaps.map((item) => ({
      ...item.dataValues,
      ClothesPost: ImageListDestructure([item.ClothesPost.dataValues])[0],
    })),
  }));

  res.status(200).send({
    success: true,
    data: { ...shop.dataValues, ClothesPosts: shopPost, ClothesGroups: groups },
  });
});
