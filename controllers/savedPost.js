const {
  AppBinaryObject,
  RestrictedWord,
  sequelize,
  Love,
} = require("../models");
const ApiError = require("../utils/ApiError");
const { createWebHook } = require("../utils/WebHook");
const catchAsync = require("../middlewares/async");
const moment = require("moment");
const baseController = require("../utils/BaseController");
const { SavedPost, Post, BookingUser } = require("../models");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");
const { Op } = require("sequelize");

exports.createSavedPost = catchAsync(async (req, res) => {
  const { PostId, UserId } = req.body;

  if (!PostId || !UserId) {
    throw new ApiError(500, "PostId && UserId is required");
  }
  const checking = await SavedPost.findOne({
    where: {
      PostId: {
        [Op.eq]: PostId,
      },
      UserId: {
        [Op.eq]: UserId,
      },
    },
  });
  if (checking) {
    throw new ApiError(500, "Bài viết đã được lưu rồi!");
  }

  const countPosts = await SavedPost.count({
    where: { UserId },
  });

  if (countPosts >= process.env.LIMIT_SAVED_POST) {
    throw new ApiError(500, "Bạn chỉ được lưu tối đa 20 bài viết!");
    // const postList = await SavedPost.findAll({
    //   where: {
    //     UserId: {
    //       [Op.eq]: UserId,
    //     },
    //   },
    //   order: [["createdAt", "ASC"]],
    // });
    // await postList[0].destroy();
  }

  let post = {};
  let user = {};
  const data = await SavedPost.create({ PostId, UserId });
  post = await Post.findByPk(PostId);
  user = await BookingUser.findByPk(UserId);
  const newData = {
    ...data.dataValues,
    Post: post.dataValues,
    User: user.dataValues,
  };
  res.status(200).send(newData);
});

exports.deleteSavedPost = catchAsync(async (req, res) => {
  const { PostId, UserId } = req.body;

  if (!PostId || !UserId) {
    throw new ApiError(500, "PostId && UserId is required");
  }
  const checking = await SavedPost.findOne({
    where: {
      UserId: {
        [Op.eq]: UserId,
      },
      PostId: {
        [Op.eq]: PostId,
      },
    },
  });

  if (!checking) {
    throw new ApiError(500, "Not found!");
  }

  await SavedPost.destroy({
    where: {
      UserId: {
        [Op.eq]: UserId,
      },
      PostId: {
        [Op.eq]: PostId,
      },
    },
  });
  res.status(200).send("Hủy lưu bài viết thành công!");
});

// exports.getListSavePost = catchAsync(async (req, res) => {
//   const { UserId, page, limit } = req.query;
//   if (!UserId) {
//     throw new ApiError(500, "PostId && UserId is required");
//   }
//   const data = await baseController.Pagination(SavedPost, page, limit, {
//     where: {
//       UserId,
//     },
//     order: [["updatedAt", "DESC"]],
//   });
//   let newData = [];
//   newData = await Promise.all(
//     data.data.map(async (val) => {
//       ////////////////////////////////
//       const newList = await sequelize.query(
//         "SELECT Posts.Id as Id,Posts.Tags,Posts.Description,Posts.Image1,Posts.Image2,Posts.Image3,Posts.Image4,Posts.Image5,Posts.Image6,Posts.TotalLikes,Posts.TotalComments,Posts.CreationTime,BookingUsers.Username,BookingUsers.Image as Avatar FROM Posts INNER JOIN BookingUsers ON  BookingUsers.Id = Posts.BookingUserId WHERE Posts.Id = :id",
//         {
//           replacements: {
//             id: val.PostId,
//           },
//           type: "SELECT",
//         }
//       );
//       if (!newList[0]) {
//         throw new ApiError(404, "Post not found");
//       }
//       ////////////////////////////
//       const savedPost = await Post.findOne({
//         where: {
//           Id: val.PostId,
//         },
//       });
//       return {
//         ...val.dataValues,
//         savedPost: ImageListDestructure(newList /* .dataValues */)[0],
//       };
//     })
//   );

//   res.status(200).json({
//     ...data,
//     data: newData,
//   });
// });

exports.getListSavePost = catchAsync(async (req, res) => {
  const { UserId, page, limit } = req.query;
  if (!UserId) {
    throw new ApiError(500, "UserId is required");
  }
  let data = await SavedPost.findAll({
    where: {
      UserId: UserId,
    },
    include: {
      model: Post,
      include: [
        { model: Love, attributes: ["UserId"] },
        { model: BookingUser, attributes: ["Fullname", "Image"] },
      ],
      order: [["CreationTime", "DESC"]],
    },
  });
  res.status(200).json({
    success: true,
    data: ImageListDestructure(
      data.map((item) => item.dataValues.Post.dataValues)
    ),
  });
});

exports.getListPostById = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  // const { id } = req?.user;
  // if (!UserId) {
  //   throw new ApiError(500, "PostId && UserId is required");
  // }

  const data = await Post.findAll({
    where: {
      BookingUserId: req?.user?.id,
      IsDeleted: false,
    },
    order: [["CreationTime", "DESC"]],
    include: [
      { model: BookingUser, attributes: ["Image", "Fullname"] },
      { model: Love, attributes: ["UserId"] },
    ],
  });

  res.status(200).json({
    success: true,
    data: ImageListDestructure(data.map((item) => item.dataValues)),
  });
});
