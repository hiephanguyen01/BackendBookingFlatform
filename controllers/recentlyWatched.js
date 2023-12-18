const {
  ResentWatched,
  Sequelize,
  StudioPost,
  PhotographerPost,
  DevicePost,
  ClothesPost,
  MakeupPost,
  ModelPost,
} = require("../models");
const catchAsync = require("../middlewares/async");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");

exports.getRecentlyWatched = catchAsync(async (req, res) => {
  const BookingUserId = req.user.id;
  const recentlyWatchedListRaw = await ResentWatched.findAll({
    where: {
      BookingUserId,
    },
    order: [["createdAt", "DESC"]],
  });
  const recentlyWatchedList = await Promise.all(
    recentlyWatchedListRaw.map(async (val) => {
      const Watched = val.toJSON();
      let Post;
      switch (Watched.Category) {
        case 1:
          Post = await StudioPost.findOne({ where: { Id: Watched.PostId } });
          return { ...Post?.dataValues, category: 1 };
        case 2:
          Post = await PhotographerPost.findOne({
            where: { Id: Watched.PostId },
          });
          return { ...Post?.dataValues, category: 2 };
        case 3:
          Post = await ClothesPost.findOne({ where: { Id: Watched.PostId } });
          return { ...Post?.dataValues, category: 3 };
        case 4:
          Post = await MakeupPost.findOne({ where: { Id: Watched.PostId } });
          return { ...Post?.dataValues, category: 4 };
        case 5:
          Post = await DevicePost.findOne({ where: { Id: Watched.PostId } });
          return { ...Post?.dataValues, category: 5 };
        case 6:
          Post = await ModelPost.findOne({ where: { Id: Watched.PostId } });
          return { ...Post?.dataValues, category: 6 };
        default:
          break;
      }
    })
  );
  res.status(200).json(ImageListDestructure(recentlyWatchedList));
});
exports.createRecentlyWatched = catchAsync(async (req, res) => {
  const listSize = 12;
  const { PostId, Category } = req.body;
  const BookingUserId = req.user.id;
  await ResentWatched.destroy({
    where: {
      BookingUserId,
      PostId,
      Category,
    },
  });
  await ResentWatched.create({
    BookingUserId,
    PostId,
    Category,
  });
  const recentlyWatchedListRaw = await ResentWatched.findAll({
    where: {
      BookingUserId,
    },
  });
  const recentlyWatchedList = recentlyWatchedListRaw.map((val) => val.toJSON());
  let data;
  if (recentlyWatchedList.length > listSize) {
    data = await ResentWatched.findOne({
      where: {
        BookingUserId,
      },
      attributes: [Sequelize.fn("min", Sequelize.col("createdAt")), "id"],
      group: ["id"],
    });
    await ResentWatched.destroy({ where: { id: data?.dataValues.id } });
  }

  res.status(200).json({
    success: true,
  });
});
