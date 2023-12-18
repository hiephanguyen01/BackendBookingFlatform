const {
  AppBinaryObject,
  RestrictedWord,
  sequelize,
  NotificationPost,
  BookingUser,
  Love,
  DaoReport,
} = require("../models");
const { Post } = require("../models");
const { Comment } = require("../models");

const catchAsync = require("../middlewares/async");
const { Op, where } = require("sequelize");
const ApiError = require("../utils/ApiError");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");
const { createWebHook } = require("../utils/WebHook");
const moment = require("moment");
const constant = [
  "studio",
  "makeup",
  "nguoimau",
  "nhiepanh",
  "thietbi",
  "trangphuc",
];
const {
  createWebHookEvents,
  createWebHookSendAttempts,
} = require("./adminWebhook");
exports.postPost = catchAsync(async (req, res) => {
  let { Tags, Description, imageDrive, id } = req.body;
  if (imageDrive !== undefined) {
    imageDrive = imageDrive.split(",");
  }
  rawOptions = Tags.split(",");
  const BannedWords = await RestrictedWord.findAll({ attributes: ["Value"] });
  const ListBanWord = BannedWords.map((val) => val.dataValues.Value);

  const overlap = ListBanWord.reduce((newList, banWord) => {
    if (Description.toUpperCase().includes(banWord.toUpperCase())) {
      return [...newList, banWord];
    }
    return [...newList];
  }, []);

  if (overlap.length > 0) {
    throw new ApiError(500, `Bài đăng có chứa từ cấm: ${overlap.join(", ")}`);
  } else {
    newOptions = rawOptions
      .filter((option) => constant.indexOf(option) !== -1) //filter by constant
      .filter((option, idx) => rawOptions.indexOf(option) === idx) //make unique
      .sort()
      .join(",");

    if (!Tags) {
      throw new ApiError(500, "Please check the tag again");
    }
    let listImage = [];
    await Promise.all(
      req.files.map(async (val) => {
        let data = await AppBinaryObject.create({
          Bytes: val.buffer,
          Description: val.originalname,
        });
        listImage = [...listImage, data.dataValues.Id];
      })
    );
    let Image = listImage.reduce((acc, val, idx) => {
      const name = `Image${idx + 1}`;
      return { ...acc, [name]: val };
    }, {});

    let driveImgList = {};
    if (imageDrive !== undefined && imageDrive.length > 0) {
      const imgLength = Image.length || 0;
      driveImgList = imageDrive.reduce((acc, val, idx) => {
        const name = `DriveImg${idx + 1}`;
        return { ...acc, [name]: val };
      }, {});
    }

    const data = await Post.create({
      BookingUserId: id ? id : req.user.id,
      Tags,
      CreationTime: new Date(),
      Description,
      ...Image,
      ...driveImgList,
    });

    createWebHookEvents(req, { Data: data });
    createWebHookSendAttempts();

    res.status(200).json(data);
  }
});

exports.getAllPost = catchAsync(async (req, res) => {
  let { page, limit, tags, startDate, endDate } = req.query;
  if (startDate === "" || startDate === undefined) {
    startDate = 1;
  }
  if (endDate === undefined || endDate === "") {
    endDate = new Date();
  }
  let where;
  let rightOption;
  if (tags !== undefined && tags !== "") {
    const rawOptions = tags.split(",");
    rightOption = rawOptions
      .filter((option) => constant.indexOf(option) !== -1) //filter by constant
      .filter((option, idx) => rawOptions.indexOf(option) === idx) //make unique
      .sort()
      .join(",");
  } else {
    rightOption = constant.join(",");
  }
  const newTags = rightOption
    .split(",")
    .reduce((obj, item) => ({ ...obj, [item]: item }), {});
  where = {
    Tags: {
      [Op.or]: [
        {
          [Op.like]:
            newTags.studio === undefined ? "%...%" : "%" + newTags.studio + "%",
        },
        {
          [Op.like]:
            newTags.trangphuc === undefined
              ? "%...%"
              : "%" + newTags.trangphuc + "%",
        },
        {
          [Op.like]:
            newTags.nguoimau === undefined
              ? "%...%"
              : "%" + newTags.nguoimau + "%",
        },
        {
          [Op.like]:
            newTags.nhiepanh === undefined
              ? "%...%"
              : "%" + newTags.nhiepanh + "%",
        },
        {
          [Op.like]:
            newTags.makeup === undefined ? "%...%" : "%" + newTags.makeup + "%",
        },
        {
          [Op.like]:
            newTags.thietbi === undefined
              ? "%...%"
              : "%" + newTags.thietbi + "%",
        },
      ],
    },
    CreationTime: {
      [Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
    },
  };
  let total = await Post.count({ where });
  if (+limit <= 0 || isNaN(+limit) || +limit >= 20) {
    limit = 1;
  }
  if (+page <= 0 || isNaN(+page)) {
    page = 1;
  }
  let totalPages = Math.ceil(total / limit);
  let skip = (+page - 1) * +limit;
  if (totalPages < +page) {
    page = 1;
  }
  const newList = await sequelize.query(
    "SELECT Posts.Id as Id,Posts.Tags,Posts.Description,Posts.Image1,Posts.Image2,Posts.Image3,Posts.Image4,Posts.Image5,Posts.Image6,Posts.TotalLikes,Posts.TotalComments,Posts.CreationTime,BookingUsers.Username,BookingUsers.Fullname,BookingUsers.Image as Avatar,Posts.DriveImg1,Posts.DriveImg2,Posts.DriveImg3,Posts.DriveImg4,Posts.DriveImg5,NotificationPosts.IsActive FROM Posts left join NotificationPosts ON NotificationPosts.PostId = Posts.Id  INNER JOIN BookingUsers ON  BookingUsers.Id = Posts.BookingUserId WHERE (Posts.Tags LIKE :studio OR Posts.Tags LIKE :trangphuc OR Posts.Tags LIKE :nguoimau OR Posts.Tags LIKE :thietbi OR Posts.Tags LIKE :makeup OR Posts.Tags LIKE :nhiepanh)  AND Posts.CreationTime > :startDate AND Posts.CreationTime < :endDate ORDER BY Posts.Id DESC LIMIT :limit OFFSET :offset",
    {
      replacements: {
        studio:
          newTags.studio === undefined ? "%...%" : "%" + newTags.studio + "%",
        trangphuc:
          newTags.trangphuc === undefined
            ? "%...%"
            : "%" + newTags.trangphuc + "%",
        nguoimau:
          newTags.nguoimau === undefined
            ? "%...%"
            : "%" + newTags.nguoimau + "%",
        nhiepanh:
          newTags.nhiepanh === undefined
            ? "%...%"
            : "%" + newTags.nhiepanh + "%",
        makeup:
          newTags.makeup === undefined ? "%...%" : "%" + newTags.makeup + "%",
        thietbi:
          newTags.thietbi === undefined ? "%...%" : "%" + newTags.thietbi + "%",
        startDate: startDate,
        endDate: new Date(endDate),
        offset: +skip,
        limit: +limit,
      },
      nest: true,
      include: [
        {
          model: Comment,
          as: "comments",
        },
        {
          model: NotificationPost,
        },
      ],
      type: "SELECT",
    }
  );
  res.status(200).json({
    success: true,
    pagination: {
      totalPages,
      limit: +limit,
      total,
      currentPage: +page,
      hasNextPage: page <= totalPages - 1,
    },
    data: ImageListDestructure(newList),
  });
});

exports.getAllPostNew = catchAsync(async (req, res) => {
  let { page, limit, tags, startDate, endDate } = req.query;

  if (
    startDate === "" ||
    startDate === undefined ||
    startDate === null ||
    startDate === "null"
  ) {
    startDate = 1;
  } else {
    startDate = moment(startDate, "DD/MM/YYYY").startOf("day");
  }
  if (
    endDate === undefined ||
    endDate === "" ||
    endDate === null ||
    endDate === "null"
  ) {
    endDate = moment();
    // endDate = moment(endDate).format("MM/DD/YYYY");
  } else {
    endDate = moment(endDate, "DD/MM/YYYY").endOf("day");
  }

  if (tags === undefined || tags === "") {
    tags = constant;
  } else {
    tags = tags.split(",");
  }

  const whereClause =
    startDate === "" ||
    startDate === undefined ||
    startDate === null ||
    startDate === "null"
      ? {
          [Op.or]: tags.reduce(
            (newArr, item) => [...newArr, { Tags: { [Op.substring]: item } }],
            []
          ),
          IsDeleted: false,
        }
      : {
          [Op.or]: tags.reduce(
            (newArr, item) => [...newArr, { Tags: { [Op.substring]: item } }],
            []
          ),
          CreationTime: {
            [Op.gte]: startDate, // >= 6
            [Op.lte]: endDate, // <= 10
          },
          IsDeleted: false,
        };

  const posts = await Post.findAll({
    where: {
      ...whereClause,
    },
    include: [
      {
        model: Comment,
        as: "comments",
      },
      {
        model: Love,
        attributes: ["UserId"],
      },
      {
        model: BookingUser,
        attributes: ["Fullname", "Image"],
        // as: "comments",
        where: { IsDeleted: false },
      },
      {
        model: NotificationPost,
      },
    ],
    limit: +limit,
    offset: +limit * (+page - 1),
    order: [["id", "DESC"]],
  });
  let total = await Post.count({
    where: {
      [Op.or]: tags.reduce(
        (newArr, item) => [...newArr, { Tags: { [Op.substring]: item } }],
        []
      ),
      CreationTime: {
        [Op.gte]: startDate, // >= 6
        [Op.lte]: endDate, // <= 10
      },
    },
  });

  if (+limit <= 0 || isNaN(+limit) || +limit >= 20) {
    limit = 1;
  }
  if (+page <= 0 || isNaN(+page)) {
    page = 1;
  }
  let totalPages = Math.ceil(total / limit);
  res.status(200).json({
    success: true,
    pagination: {
      totalPages,
      limit: +limit,
      total,
      currentPage: +page,
      hasNextPage: page <= totalPages - 1,
    },
    data: ImageListDestructure(posts.map((item) => item.dataValues)),
  });
});

exports.getAllReportPost = catchAsync(async (req, res) => {
  let { page, limit, tags, startDate, endDate } = req.query;
  if (startDate === "" || startDate === undefined) {
    startDate = 1;
  }
  if (endDate === undefined || endDate === "") {
    endDate = new Date();
  }
  let where;
  let rightOption;
  if (tags !== undefined && tags !== "") {
    const rawOptions = tags.split(",");
    rightOption = rawOptions
      .filter((option) => constant.indexOf(option) !== -1) //filter by constant
      .filter((option, idx) => rawOptions.indexOf(option) === idx) //make unique
      .sort()
      .join(",");
  } else {
    rightOption = constant.join(",");
  }
  const newTags = rightOption
    .split(",")
    .reduce((obj, item) => ({ ...obj, [item]: item }), {});
  where = {
    Tags: {
      [Op.or]: [
        {
          [Op.like]:
            newTags.studio === undefined ? "%...%" : "%" + newTags.studio + "%",
        },
        {
          [Op.like]:
            newTags.trangphuc === undefined
              ? "%...%"
              : "%" + newTags.trangphuc + "%",
        },
        {
          [Op.like]:
            newTags.nguoimau === undefined
              ? "%...%"
              : "%" + newTags.nguoimau + "%",
        },
        {
          [Op.like]:
            newTags.nhiepanh === undefined
              ? "%...%"
              : "%" + newTags.nhiepanh + "%",
        },
        {
          [Op.like]:
            newTags.makeup === undefined ? "%...%" : "%" + newTags.makeup + "%",
        },
        {
          [Op.like]:
            newTags.thietbi === undefined
              ? "%...%"
              : "%" + newTags.thietbi + "%",
        },
      ],
    },
    CreationTime: {
      [Op.and]: [{ [Op.gte]: startDate }, { [Op.lte]: endDate }],
    },
  };
  let total = await Post.count({ where });
  if (+limit <= 0 || isNaN(+limit) || +limit >= 20) {
    limit = 1;
  }
  if (+page <= 0 || isNaN(+page)) {
    page = 1;
  }
  let totalPages = Math.ceil(total / limit);
  let skip = (+page - 1) * +limit;
  if (totalPages < +page) {
    page = 1;
  }
  const newList = await sequelize.query(
    "SELECT Posts.Id as Id,Posts.Tags,Posts.Description,Posts.Image1,Posts.Image2,Posts.Image3,Posts.Image4,Posts.Image5,Posts.Image6,Posts.TotalLikes,Posts.TotalComments,Posts.CreationTime,BookingUsers.Username,BookingUsers.Fullname,BookingUsers.Image as Avatar,Posts.DriveImg1,Posts.DriveImg2,Posts.DriveImg3,Posts.DriveImg4,Posts.DriveImg5, count(Posts.Id) as NumberReport FROM (Posts INNER JOIN BookingUsers ON  BookingUsers.Id = Posts.BookingUserId) INNER JOIN DaoReports ON DaoReports.PostId = Posts.Id WHERE (Posts.Tags LIKE :studio OR Posts.Tags LIKE :trangphuc OR Posts.Tags LIKE :nguoimau OR Posts.Tags LIKE :thietbi OR Posts.Tags LIKE :makeup OR Posts.Tags LIKE :nhiepanh) AND Posts.CreationTime > :startDate AND Posts.CreationTime < :endDate GROUP BY Posts.Id ORDER BY Posts.Id DESC LIMIT :limit OFFSET :offset",
    {
      replacements: {
        studio:
          newTags.studio === undefined ? "%...%" : "%" + newTags.studio + "%",
        trangphuc:
          newTags.trangphuc === undefined
            ? "%...%"
            : "%" + newTags.trangphuc + "%",
        nguoimau:
          newTags.nguoimau === undefined
            ? "%...%"
            : "%" + newTags.nguoimau + "%",
        nhiepanh:
          newTags.nhiepanh === undefined
            ? "%...%"
            : "%" + newTags.nhiepanh + "%",
        makeup:
          newTags.makeup === undefined ? "%...%" : "%" + newTags.makeup + "%",
        thietbi:
          newTags.thietbi === undefined ? "%...%" : "%" + newTags.thietbi + "%",
        startDate: startDate,
        endDate: new Date(endDate),
        offset: +skip,
        limit: +limit,
      },
      nest: true,
      include: [
        {
          model: Comment,
          as: "comments",
        },
        {
          model: NotificationPost,
          as: "hello",
        },
      ],
      type: "SELECT",
    }
  );
  res.status(200).json({
    success: true,
    pagination: {
      totalPages,
      limit: +limit,
      total,
      currentPage: +page,
      hasNextPage: page <= totalPages - 1,
    },
    data: ImageListDestructure(newList),
  });
});

exports.getAllReportPostNew = catchAsync(async (req, res) => {
  let { page, limit, tags, startDate, endDate } = req.query;
  if (startDate === "" || startDate === undefined) {
    startDate = 1;
  }
  if (endDate === undefined || endDate === "") {
    endDate = new Date();
  }
  if (tags === undefined || tags === "") {
    tags = constant;
  } else {
    tags = tags.split(",");
    // .reduce((newObj, item) => ({ ...newObj, [item]: item }), {});
  }
  const posts = await Post.findAll({
    where: {
      [Op.or]: tags.reduce(
        (newArr, item) => [...newArr, { Tags: { [Op.substring]: item } }],
        []
      ),
      CreationTime: {
        [Op.gte]: startDate, // >= 6
        [Op.lte]: endDate, // <= 10
      },
    },
    include: [
      {
        model: Comment,
        as: "comments",
      },
      {
        model: Love,
        attributes: ["UserId"],
      },
      {
        model: BookingUser,
        attributes: ["Fullname", "Image"],
        // as: "comments",
        where: { IsDeleted: false },
      },
      {
        model: NotificationPost,
      },
      {
        model: DaoReport,
        required: true,
      },
    ],
    limit: +limit,
    offset: +limit * (+page - 1),
    order: [["id", "DESC"]],
  });
  let total = await Post.count({
    where: {
      [Op.or]: tags.reduce(
        (newArr, item) => [...newArr, { Tags: { [Op.substring]: item } }],
        []
      ),
      CreationTime: {
        [Op.gte]: startDate, // >= 6
        [Op.lte]: endDate, // <= 10
      },
    },
  });

  if (+limit <= 0 || isNaN(+limit) || +limit >= 20) {
    limit = 1;
  }
  if (+page <= 0 || isNaN(+page)) {
    page = 1;
  }
  let totalPages = Math.ceil(total / limit);
  res.status(200).json({
    success: true,
    pagination: {
      totalPages,
      limit: +limit,
      total,
      currentPage: +page,
      hasNextPage: page <= totalPages - 1,
    },
    data: ImageListDestructure(posts.map((item) => item.dataValues)),
  });
});

exports.getPostById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const newList = await sequelize.query(
    "SELECT Posts.Id as Id,Posts.Tags,Posts.Description,Posts.Image1,Posts.Image2,Posts.Image3,Posts.Image4,Posts.Image5,Posts.Image6,Posts.TotalLikes,Posts.TotalComments,Posts.CreationTime,BookingUsers.Username,BookingUsers.Fullname,BookingUsers.Image as Avatar FROM Posts INNER JOIN BookingUsers ON  BookingUsers.Id = Posts.BookingUserId WHERE Posts.Id = :id",
    {
      replacements: {
        id,
      },
      type: "SELECT",
    }
  );
  if (!newList[0]) {
    throw new ApiError(404, "Post not found");
  }
  res.status(200).json(ImageListDestructure(newList)[0]);
});

exports.getPostByIdNew = catchAsync(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Comment,
        as: "comments",
      },
      {
        model: Love,
        attributes: ["UserId"],
      },
      {
        model: BookingUser,
        attributes: ["Fullname", "Image"],
        // as: "comments",
        where: { IsDeleted: false },
      },
      {
        model: NotificationPost,
      },
    ],
  });
  res.status(200).json(ImageListDestructure([post.dataValues])[0]);
});

exports.deletePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByPk(id);
  const { Image1, Image2, Image3, Image4, Image5, Image6 } = post;
  const ImageList = [Image1, Image2, Image3, Image4, Image5, Image6];

  await Promise.all(
    ImageList.map(async (val) => {
      if (val !== null) {
        await AppBinaryObject.destroy({ where: { id: val } });
      }
    })
  );
  await Post.destroy({ where: { id } });
  res.status(200).json({
    success: true,
    message: "Delete success",
  });
});

exports.updatePost = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { IsDeleted } = req.body;
  const post = await Post.findByPk(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  // const { Image1, Image2, Image3, Image4, Image5, Image6 } = post;
  // const ImageList = [Image1, Image2, Image3, Image4, Image5, Image6];

  // await Promise.all(
  //   ImageList.map(async (val) => {
  //     if (val !== null) {
  //       await AppBinaryObject.destroy({ where: { id: val } });
  //     }
  //   })
  // );
  await Post.update({ IsDeleted }, { where: { id } });
  res.status(200).json({
    success: true,
    message: "Delete success",
    data: ImageListDestructure([post.dataValues])[0],
  });
});
