const {
  Comment,
  BookingUser,
  StudioRoom,
  PhotographerServicePackage,
  MakeupServicePackage,
  ClothesPost,
  ModelPost,
  DevicePost,
  StudioPost,
  PhotographerPost,
  MakeupPost,
  DaoReport,
  LikeComment,
} = require("../models");
const { Post } = require("../models");
const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");

exports.createComment = catchAsync(async (req, res) => {
  const { PostId, Content, Services } = req.body;
  const BookingUserId = req.user?.id || 5;
  if (!PostId || (!Content && !Services)) {
    throw new ApiError(500, "PostId && Content && Services is required");
  }
  const comment = await Comment.create({
    Content,
    BookingUserId,
    PostId,
    Services,
  });
  const countComment = await Comment.count({ where: { PostId } });
  await Post.update({ TotalComments: countComment }, { where: { Id: PostId } });
  res.status(200).send(comment);
});

exports.updateComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { Content, Services } = req.body;
  const BookingUserId = req?.user?.id;
  await Comment.update(
    {
      Content,
      Services,
    },
    { where: { id, BookingUserId } }
  );
  res.status(200).send({ success: true });
});

exports.getCommentsByPostId = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { page, limit } = req.query;
  if (!page || isNaN(page)) {
    page = 1;
  }
  if (!limit) {
    limit = 5;
  }
  let comments = await Comment.findAll({
    where: {
      PostId: id,
    },
    include: [
      {
        model: BookingUser,
        attributes: ["Fullname", "Image"],
      },
    ],
  });

  comments = await Promise.all(
    comments.map(async (comment) => {
      if (comment.dataValues.Services) {
        let servicesParse = JSON.parse(comment.dataValues.Services);
        let services = servicesParse.reduce(async (arrService, item) => {
          let service = {};
          switch (item.category) {
            case 1:
              service = await StudioPost.findOne({
                where: {
                  Id: item.serviceId,
                },
              });
              break;
            case 2:
              service = await PhotographerPost.findOne({
                where: {
                  Id: item.serviceId,
                },
              });

              break;
            case 3:
              service = await ClothesPost.findOne({
                where: {
                  Id: item.serviceId,
                },
              });
              break;
            case 4:
              service = await MakeupPost.findOne({
                where: {
                  Id: item.serviceId,
                },
              });
              break;
            case 6:
              service = await ModelPost.findOne({
                where: {
                  Id: item.serviceId,
                },
              });
              break;
            case 5:
              service = await DevicePost.findOne({
                where: {
                  Id: item.serviceId,
                },
              });
              break;
            default:
              break;
          }
          return [
            ...(await arrService),
            { ...service.dataValues, category: item.category },
          ];
        }, []);
        return {
          ...comment,
          services: await services,
        };
      }
      return comment;
    })
  );

  const totalPages = Math.ceil(comments.length / limit);
  if (page > totalPages) {
    throw new ApiError(500, `total page is ${totalPages}`);
  }

  comments = await Promise.all(
    comments
      .sort((a, b) => b.dataValues.id - a.dataValues.id)
      .slice((page - 1) * limit, page * limit)
      .map(async (itm) => {
        let like = await LikeComment.findAll({
          where: { CommentId: itm.dataValues.id },
          attributes: ["UserId"],
        });
        return {
          ...itm.dataValues,
          Likes: like || [],
          services: ImageListDestructure(itm?.services) || [],
        };
      })
  );

  res.status(200).json({
    success: true,
    pagination: {
      totalPages,
      limit: +limit,
      total: comments.length,
      currentPage: +page,
      hasNextPage: page <= totalPages - 1,
    },
    data: comments,
  });
});

exports.getCommentsByPostReportId = catchAsync(async (req, res) => {
  const { id } = req.params;
  let comments = await DaoReport.findAll({
    where: {
      PostId: id,
    },
    include: [
      {
        model: BookingUser,
        attributes: ["Fullname", "Image"],
      },
    ],
  });

  res.status(200).json({
    success: true,
    data: comments,
  });
});

exports.likeComment = catchAsync(async (req, res) => {
  const { CommentId } = req.body;
  const userId = req.user.id;
  const existed = await LikeComment.findOne({
    where: { UserId: userId, CommentId: CommentId },
  });
  if (existed) {
    await LikeComment.destroy({
      where: {
        Id: existed.id,
      },
    });
  } else {
    await LikeComment.create({ UserId: userId, CommentId: CommentId });
  }
  const countComment = await LikeComment.count({
    where: { CommentId: CommentId },
  });
  await Comment.update(
    { TotalLike: countComment },
    { where: { id: CommentId } }
  );

  res.status(200).json({
    success: true,
  });
});
