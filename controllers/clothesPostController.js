const catchAsync = require("../middlewares/async");
const { ClothesPost, sequelize, ClothesPost_User } = require("../models");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");
const factory = require("./factoryController");

// exports.getTop10OrderClothesPost = factory.getTop10Oder(ClothesPosts);
exports.getTop10OrderClothesPost = catchAsync(async (req, res) => {
  let data = await ClothesPost.findAll({
    order: [["BookingCount", "DESC"]],
    limit: 10,
    include: {
      model: ClothesPost_User,
      as: "UsersLiked",
      attributes: ["UserId"],
    },
  });
  (data = ImageListDestructure(
    data.map((val) => ({
      ...val.dataValues,
    }))
  )),
    res.status(200).send(data);
  res.status(200).send(data);
});
