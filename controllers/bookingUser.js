const {
  BookingUser,
  StudioPost_User,
  PhotographerPost_User,
  ClothesPost_User,
  MakeupPost_User,
  DevicePost_User,
  ModelPost_User,
  ModelPost,
  DevicePost,
  Makeup,
  ClothesPost,
  PhotographerPost,
  StudioPost,
  AppBinaryObject,
  Conversation,
  ConversationUsers,
  Message,
  MessagesUser,
  MakeupPost,
  StudioBooking,
  PhotographerBooking,
  ClothesBooking,
  MakeUpBooking,
  ModelBooking,
  DeviceBooking,
  AbpWebhookEvent,
  TokenNotRegisterUser,
} = require("../models");
const moment = require("moment");
const catchAsync = require("../middlewares/async");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const baseController = require("../utils/BaseController");
const md5 = require("md5");
const { ImageListDestructure } = require("../utils/ListWithImageDestructure");
const {
  createWebHookSendAttempts,
  createWebHookEvents,
} = require("./adminWebhook");

const options = {
  method: "POST",
  port: 3003,
  timeout: 8000,
};
exports.createBookingUser = catchAsync(async (req, res) => {
  const { providerId, password, phoneNumber } = req.body;
  const photoUrl = req.body.auth?.currentUser.photoURL;
  const uid = req.body.auth?.currentUser.uid;
  const email = req.body.auth?.currentUser.email;
  const displayName = req.body.auth?.currentUser.displayName;
  let Username,
    Email,
    Phone,
    HashPassword,
    Salt,
    Fullname,
    FacebookId,
    FacebookToken,
    FacebookFirstname,
    FacebookLastname,
    FacebookEmail,
    FacebookPicture,
    GoogleEmail,
    GoogleName,
    GooglePicture,
    TokenEmail;

  if (password) {
    Salt = bcrypt.genSaltSync(16);
    HashPassword = md5(password + Salt);
  }
  if (providerId === "facebook.com") {
    FacebookId = uid;
    FacebookToken = null;
    FacebookFirstname = displayName || req.body.firstName;
    FacebookLastname = displayName || req.body.lastName;
    Fullname = displayName || req.body.displayName;
    FacebookEmail =
      req?.body?.auth?.currentUser?.providerData[0]?.email ||
      req?.body?.email ||
      (req?.body?.federatedId
        ? req?.body?.federatedId.split("facebook.com/")[1]
        : null);
    FacebookPicture = photoUrl || req.body.photoUrl;
    FacebookToken = req.body.oauthAccessToken;
  } else if (providerId === "google.com") {
    GoogleEmail = email;
    GoogleName = displayName;
    GooglePicture = photoUrl;
    TokenEmail = req.body.accessToken;
  } else {
    // Email = phoneNumber + "@null";
    Fullname = phoneNumber;
    Username = phoneNumber;
    Phone = "0" + phoneNumber.split("+84")[1];
    HashPassword = HashPassword;
    Salt = Salt;
  }
  const data = {
    Email: Email || null,
    Username: Username || null,
    Phone: Phone || null,
    HashPassword: HashPassword || null,
    Salt: Salt || null,
    Fullname: Fullname || GoogleName || null,
    Image: GooglePicture || FacebookPicture || null,
    FacebookId: FacebookId || null,
    GoogleEmail: GoogleEmail || null,
    FacebookToken: FacebookToken || null,
    FacebookFirstname: FacebookFirstname || null,
    FacebookLastname: FacebookLastname || null,
    FacebookEmail: FacebookEmail || null,
    FacebookPicture: FacebookPicture || null,
    GoogleName: GoogleName || null,
    GooglePicture: GooglePicture || null,
    CreatedDate: Date.now(),
    UpdatedDate: Date.now(),
    IsDeleted: 0,
    UpdatedBy: 0,
    Status: 1,
    UserTypeId: 2,
    CreationTime: Date.now(),
    IsActiveEmail: GoogleEmail ? true : false,
    TokenEmail: TokenEmail || null,
  };

  let checker;
  if (providerId === "facebook.com") {
    checker = await BookingUser.findOne({
      where: {
        [Op.or]: [
          { FacebookEmail: data.FacebookEmail },
          {
            FacebookEmail: req?.body?.federatedId
              ? req?.body?.federatedId.split("facebook.com/")[1]
              : null,
          },
        ],
        // FacebookEmail: data.FacebookEmail,
      },
    });
  } else if (providerId === "google.com") {
    checker = await BookingUser.findOne({
      where: {
        GoogleEmail: data.GoogleEmail,
      },
    });
  } else {
    checker = await BookingUser.findOne({
      where: {
        Phone: Phone,
      },
    });
  }

  // const newData = Object.keys(data).reduce((newObj, item) => {
  //   if (data[item] !== undefined) {
  //     return { ...newObj, [item]: data[item] };
  //   }
  //   return { ...newObj };
  // }, {});

  if (checker) {
    if (checker.dataValues.IsDeleted) {
      throw new ApiError(
        400,
        "Tài khoản đã bị khóa, vui lòng liên hệ hotline!!!"
      );
    }
    const token = jwt.sign(
      {
        id: checker.dataValues.id,
        Email:
          checker.dataValues.Email ||
          checker.dataValues.GoogleEmail ||
          checker.dataValues.FacebookEmail,
        Fullname: checker.dataValues.Fullname,
      },
      process.env.SECRET,
      {
        expiresIn: 86164,
      }
    );
    if (providerId === "facebook.com") {
      await BookingUser.update(
        { FacebookToken: data.FacebookToken },
        {
          where: {
            FacebookEmail: data.FacebookEmail,
          },
        }
      );
      checker = await BookingUser.findOne({
        where: {
          FacebookEmail: data.FacebookEmail,
        },
      });
    } else if (providerId === "google.com") {
      await BookingUser.update(
        { TokenEmail: data.TokenEmail },
        {
          where: {
            GoogleEmail: data.GoogleEmail,
          },
        }
      );
      checker = await BookingUser.findOne({
        where: {
          GoogleEmail: data.GoogleEmail,
        },
      });
    } else {
      await BookingUser.update(
        { HashPassword: data.HashPassword, Salt: data.Salt },
        {
          where: {
            Phone: data.Phone,
          },
        }
      );
      checker = await BookingUser.findOne({
        where: {
          Phone: data.Phone,
        },
      });
    }
    return res.status(201).json({
      success: true,
      data: checker,
      token,
      providerId,
    });
  }
  let image;
  if (providerId === "facebook.com") {
    image = FacebookPicture;
  } else if (providerId === "google.com") {
    image = GooglePicture;
  } else {
    image = null;
  }
  const user = await BookingUser.create({ ...data, Image: image });
  const conver = await ConversationUsers.create({
    UserId: user.toJSON().id,
    AdminId: 10,
  });
  await MessagesUser.create({
    ConversationId: conver.toJSON().id,
    Content: "Chào mừng bạn đến với Booking Studio ",
    PartnerId: null,
    CustomerId: -1,
    AdminId: 10,
    Type: "text",
  });
  const token = jwt.sign(
    {
      id: user.dataValues.id,
      Email: user.dataValues.Email,
      Fullname: user.dataValues.Fullname,
    },
    process.env.SECRET,
    {
      expiresIn: 86164,
    }
  );
  res.status(201).json({
    success: true,
    data: user,
    token,
    providerId,
  });
});

exports.logout = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const user = await BookingUser.findOne({
    where: {
      Id: userId,
      IsDeleted: false,
    },
  });
  if (user.TokenEmail !== null) {
    await BookingUser.update({ TokenEmail: null }, { where: { Id: userId } });
  } else if (user.FacebookToken !== null) {
    await BookingUser.update(
      { FacebookToken: null },
      { where: { Id: userId } }
    );
  }

  res.status(201).json({
    success: true,
  });
});

exports.loginByPhoneNumber = catchAsync(async (req, res) => {
  let { phoneNumber, password } = req.body;
  if (phoneNumber.includes("+84")) {
    phoneNumber = "0" + phoneNumber.split("+84")[1];
  }
  const user = await BookingUser.findOne({
    where: {
      Phone: phoneNumber,
      IsDeleted: false,
    },
  });
  if (!user) {
    throw new ApiError(404, "Login fail !!!");
  }
  const Salt = user.dataValues.Salt;
  const HashPassword = md5(password + Salt);
  const checkPassword = HashPassword === user.dataValues.HashPassword;
  if (!checkPassword) {
    throw new ApiError(404, "Login fail !!!");
  }
  const token = jwt.sign(
    {
      id: user.dataValues.id,
      Email: user.dataValues.Email,
      Fullname: user.dataValues.Fullname,
    },
    process.env.SECRET,
    {
      expiresIn: 86164,
    }
  );
  res.status(201).json({
    success: true,
    data: user,
    token,
  });
});

exports.me = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const data = jwt.verify(token, process.env.SECRET);
  const user = await BookingUser.findByPk(data.id);
  res.json({
    success: true,
    user: user,
  });
});

exports.getAllBookingUser = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const bookingUser = await baseController.Pagination(BookingUser, page, limit);
  const data = {
    ...bookingUser,
    data: await Promise.all(
      bookingUser.data.map(async (val) => {
        const count = await StudioBooking.count({
          where: { BookingUserId: val.id },
        });

        return {
          id: val.id,
          IdentifierCode: `CUS-${("0000000000" + val.id).slice(-10)}`,
          Phone: val.Phone,
          Email: val.Email,
          NumberOfBooking: count,
          CreationTime: val.CreationTime,
          LastModificationTime: val.LastModificationTime,
          IsDeleted: val.IsDeleted,
          Note: val.Note,
        };
      })
    ),
  };

  res.status(200).json({
    ...data,
  });
});

exports.updateBookingUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const {
    Email,
    Username,
    Phone,
    Fullname,
    Status,
    Image,
    password,
    IsDeleted,
    LastModificationTime,
    Note,
  } = req.body;
  const user = await BookingUser.findByPk(id);
  if (password) {
    const Salt = user.dataValues.Salt;
    const HashPassword = md5(password + Salt);
    const checkPassword = HashPassword === user.dataValues.HashPassword;
    if (!checkPassword) {
      throw new ApiError(400, "invalid password");
    }
    await BookingUser.update(
      {
        Email,
        Username,
        Phone,
        Fullname,
        Status,
        Image,
        HashPassword,
        IsDeleted,
        Note,
        LastModificationTime,
      },
      {
        where: {
          id,
        },
      }
    );
  } else {
    await BookingUser.update(
      {
        Email,
        Username,
        Phone,
        Fullname,
        Status,
        Image,
        IsDeleted,
        Note,
        LastModificationTime,
      },
      {
        where: {
          id,
        },
      }
    );
  }

  res.status(200).json({
    success: true,
    message: "Update success",
  });
});

exports.getBookingUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await BookingUser.findByPk(id);
  if (!user) {
    throw new ApiError(404, "user not found!");
  }
  const count = await StudioBooking.count({
    where: { BookingUserId: id },
  });
  const data = {
    Fullname: user.Fullname,
    Image: user.Image,
    id: user.id,
    IdentifierCode: `CUS-${("0000000000" + user.id).slice(-10)}`,
    Phone: user.Phone,
    Email: user.Email,
    NumberOfOrder: count,
    CreationTime: user.CreationTime,
    LastModificationTime: user.LastModificationTime,
    IsDeleted: user.IsDeleted,
    GoogleEmail: user.GoogleEmail,
    FacebookEmail: user.FacebookEmail,
    GoogleName: user.GoogleName,
    Note: user.Note,
  };

  res.status(200).json(data);
});

exports.filterBookingUser = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  let { CreateDate, updateDate, keyString, IsDeleted } = req.body;
  const regex = /(\d+)$/;
  if (
    (!CreateDate?.endDate || !CreateDate?.startDate) &&
    (updateDate?.endDate || updateDate?.startDate)
  ) {
    const bookingUser = await baseController.Pagination(
      BookingUser,
      page,
      limit,
      {
        where: {
          [Op.or]: [
            {
              Email: {
                [Op.like]: keyString ? `%${keyString}%` : "%%",
              },
            },
            {
              Fullname: {
                [Op.like]: keyString ? `%${keyString}%` : "%%",
              },
            },
            {
              FacebookEmail: {
                [Op.like]: keyString ? `%${keyString}%` : "%%",
              },
            },
            {
              GoogleEmail: {
                [Op.like]: keyString ? `%${keyString}%` : "%%",
              },
            },
            {
              Phone: {
                [Op.like]: keyString ? `%${keyString}%` : "%%",
              },
            },
            {
              Id: {
                [Op.like]: keyString.match(regex)
                  ? parseInt(keyString.match(regex)[1])
                  : null,
              },
            },
          ],
          IsDeleted: IsDeleted,
          CreationTime: {
            [Op.or]: [
              {
                [Op.gte]: CreateDate?.startDate
                  ? moment(CreateDate.startDate).startOf("day").utc()
                  : 1,
                [Op.lte]: CreateDate?.endDate
                  ? moment(CreateDate.endDate).endOf("day").utc()
                  : moment().utc(),
              },
            ],
          },
          LastModificationTime: !updateDate?.startDate
            ? {
                [Op.or]: [
                  {
                    [Op.gte]: updateDate?.startDate
                      ? moment(updateDate.startDate).startOf("day").utc()
                      : 1,
                    [Op.lte]: updateDate?.endDate
                      ? moment(updateDate.endDate).endOf("day").utc()
                      : moment().utc(),
                  },
                  updateDate?.startDate
                    ? { [Op.not]: null }
                    : { [Op.eq]: null },
                ],
              }
            : {
                [Op.or]: [
                  {
                    [Op.gte]: updateDate?.startDate
                      ? moment(updateDate.startDate).startOf("day").utc()
                      : 1,
                    [Op.lte]: updateDate?.endDate
                      ? moment(updateDate.endDate).endOf("day").utc()
                      : moment().utc(),
                  },
                ],
              },
        },
      }
    );
    const data = {
      ...bookingUser,
      data: await Promise.all(
        bookingUser.data.map(async (val) => {
          const count = await StudioBooking.count({
            where: { BookingUserId: val.id },
          });
          return {
            id: val.id,
            IdentifierCode: `CUS-${("0000000000" + val.id).slice(-10)}`,
            Phone: val.Phone,
            Email: val.Email,
            NumberOfBooking: count,
            CreationTime: val.CreationTime,
            LastModificationTime: val.LastModificationTime,
            IsDeleted: val.IsDeleted,
            Fullname: val.Fullname,
            // BookingCount: val.BookingCount,
          };
        })
      ),
    };
    return res.status(200).json({
      ...data,
    });
  } else if (
    keyString ||
    CreateDate?.startDate ||
    CreateDate?.endDate ||
    updateDate?.startDate ||
    updateDate?.endDate ||
    IsDeleted !== ""
  ) {
    const bookingUser = await baseController.Pagination(
      BookingUser,
      page,
      limit,
      {
        where: {
          [Op.or]: [
            {
              Email: {
                [Op.like]: keyString ? `%${keyString}%` : "%%",
              },
            },
            {
              Fullname: {
                [Op.like]: keyString ? `%${keyString}%` : "%%",
              },
            },
            {
              FacebookEmail: {
                [Op.like]: keyString ? `%${keyString}%` : "%%",
              },
            },
            {
              GoogleEmail: {
                [Op.like]: keyString ? `%${keyString}%` : "%%",
              },
            },
            {
              Phone: {
                [Op.like]: keyString ? `%${keyString}%` : "%%",
              },
            },
            {
              Id: {
                [Op.like]: keyString.match(regex)
                  ? parseInt(keyString.match(regex)[1])
                  : null,
              },
            },
          ],
          IsDeleted:
            IsDeleted !== "" ? { [Op.in]: [IsDeleted] } : { [Op.notIn]: "" },
          CreationTime: {
            [Op.or]: [
              {
                [Op.gte]: CreateDate?.startDate
                  ? moment(CreateDate.startDate).startOf("day").utc()
                  : 1,
                [Op.lte]: CreateDate?.endDate
                  ? moment(CreateDate.endDate).endOf("day").utc()
                  : moment().utc(),
              },
            ],
          },
          LastModificationTime: !updateDate?.startDate
            ? {
                [Op.or]: [
                  {
                    [Op.gte]: updateDate?.startDate
                      ? moment(updateDate.startDate).startOf("day").utc()
                      : 1,
                    [Op.lte]: updateDate?.endDate
                      ? moment(updateDate.endDate).endOf("day").utc()
                      : moment().utc(),
                  },
                  updateDate?.startDate
                    ? { [Op.not]: null }
                    : { [Op.eq]: null },
                ],
              }
            : {
                [Op.or]: [
                  {
                    [Op.gte]: updateDate?.startDate
                      ? moment(updateDate.startDate).startOf("day").utc()
                      : 1,
                    [Op.lte]: updateDate?.endDate
                      ? moment(updateDate.endDate).endOf("day").utc()
                      : moment().utc(),
                  },
                ],
              },
        },
      }
    );
    const data = {
      ...bookingUser,
      data: await Promise.all(
        bookingUser.data.map(async (val) => {
          const count = await StudioBooking.count({
            where: { BookingUserId: val.id },
          });
          return {
            id: val.id,
            IdentifierCode: `CUS-${("0000000000" + val.id).slice(-10)}`,
            Phone: val.Phone,
            Email: val.Email,
            NumberOfBooking: count,
            CreationTime: val.CreationTime,
            LastModificationTime: val.LastModificationTime,
            IsDeleted: val.IsDeleted,
            Fullname: val.Fullname,
          };
        })
      ),
    };

    res.status(200).json({
      ...data,
    });
  } else {
    const bookingUser = await baseController.Pagination(
      BookingUser,
      page,
      limit
    );

    const data = {
      ...bookingUser,
      data: await Promise.all(
        bookingUser.data.map(async (val) => {
          const count = await StudioBooking.count({
            where: { BookingUserId: val.id },
          });
          return {
            id: val.id,
            IdentifierCode: `CUS-${("0000000000" + val.id).slice(-10)}`,
            Phone: val.Phone,
            Email: val.Email,
            NumberOfBooking: count,
            CreationTime: val.CreationTime,
            LastModificationTime: val.LastModificationTime,
            IsDeleted: val.IsDeleted,
            Fullname: val.Fullname,
          };
        })
      ),
    };

    res.status(200).json({
      ...data,
    });
  }
});

exports.updateMe = catchAsync(async (req, res) => {
  const { passwordCurrent, password } = req.body;
  const id = req.user.id;
  const Image = req.file ? req.file : null;
  const user = await BookingUser.findByPk(id, { where: { IsDeleted: false } });
  if (!user) {
    throw new ApiError(404, "User is not exist!");
  }

  if (passwordCurrent && password) {
    const Salt = user.dataValues.Salt;
    const HashPassword = md5(passwordCurrent + Salt);
    const checkPassword = HashPassword === user.dataValues.HashPassword;
    if (!checkPassword) {
      throw new ApiError(400, "Password current not match");
    }
    req.body.HashPassword = md5(password + Salt);
  }
  let ImageNotification;
  if (Image) {
    ImageNotification = await AppBinaryObject.create({
      Bytes: Image.buffer,
      Description: "avatar" + Image.originalname,
    });
    req.body.Image = ImageNotification.dataValues.Id;
  }
  req.body.LastModificationTime = new Date();
  req.body.LastModifierUserId = id;
  let filteredBody;
  if (req.body.Email !== user.dataValues.Email && req.body.Email) {
    const check = await BookingUser.findOne({
      where: { Email: req.body.Email, Id: { [Op.ne]: id } },
    });
    if (check) throw new ApiError(400, "This email is already existed");

    const token = jwt.sign(
      {
        id: req.user.id,
        Email: req.body.Email,
      },
      process.env.SECRET,
      {
        expiresIn: process.env.TOKEN_EMAIL_EXPIRE,
      }
    );
    await BookingUser.update(
      { IsActiveEmail: false, TokenEmail: token },
      { where: { Id: req.user.id } }
    );

    const htmlContent = `https://bookingstudio.vn/verify/${token}`;
    const EmailData = [
      {
        key: "!-- Linkk -->",
        value: htmlContent,
      },
      {
        key: "<!-- Email -->",
        value: req.body.Email,
      },
    ];
    baseController.sendHTMLmail(3, req.body.Email, EmailData);
    // res.status(200).send({ success: true, msg: "success" });
  }
  if (req.file) {
    filteredBody = baseController.filterObj(
      req.body,
      "Fullname",
      "Email",
      "HashPassword",
      "Phone",
      "Image",
      "LastModificationTime",
      "LastModifierUserId"
    );
  } else {
    filteredBody = baseController.filterObj(
      req.body,
      "Fullname",
      "Email",
      "HashPassword",
      "Phone",
      "LastModificationTime",
      "LastModifierUserId"
    );
  }
  const data = await BookingUser.update(
    {
      ...filteredBody,
      Email:
        filteredBody.Email === "null" || filteredBody.Email === ""
          ? null
          : filteredBody.Email,
    },
    {
      where: { Id: id, IsDeleted: false },
    }
  );

  // await createWebHookEvents({
  //   Data: data,
  //   WebhookSubscriptionId: "8eca06e3-0749-4483-991a-891bac2d9847",
  // });
  createWebHookEvents(req, { Data: data });
  createWebHookSendAttempts();

  res.status(200).send({ success: true, msg: "Update success!" });
});

exports.deleteMe = catchAsync(async (req, res) => {
  const id = req.user.id;
  // const orders
  const currentDate = new Date();

  const dayCompare = moment(
    currentDate.setMonth(currentDate.getMonth() - 3)
  ).toISOString();

  let amountOrderByCategory;
  amountOrderByCategory = await StudioBooking.count({
    where: {
      CreationTime: { [Op.gte]: dayCompare },
      BookingUserId: id,
    },
  });
  if (amountOrderByCategory > 0) {
    throw new ApiError(
      500,
      "Không thể xóa tài khoản vì có đơn hàng trong vòng 120 ngày gần nhất!"
    );
  }
  amountOrderByCategory = await PhotographerBooking.count({
    where: {
      CreationTime: { [Op.gte]: dayCompare },
      BookingUserId: id,
    },
  });

  if (amountOrderByCategory > 0) {
    throw new ApiError(
      500,
      "Không thể xóa tài khoản vì có đơn hàng trong vòng 120 ngày gần nhất!"
    );
  }

  amountOrderByCategory = await ClothesBooking.count({
    where: {
      CreationTime: { [Op.gte]: dayCompare },
      BookingUserId: id,
    },
  });

  if (amountOrderByCategory > 0) {
    throw new ApiError(
      500,
      "Không thể xóa tài khoản vì có đơn hàng trong vòng 120 ngày gần nhất!"
    );
  }

  amountOrderByCategory = await MakeUpBooking.count({
    where: {
      CreationTime: { [Op.gte]: dayCompare },
      BookingUserId: id,
    },
  });

  if (amountOrderByCategory > 0) {
    throw new ApiError(
      500,
      "Không thể xóa tài khoản vì có đơn hàng trong vòng 120 ngày gần nhất!"
    );
  }

  amountOrderByCategory = await ModelBooking.count({
    where: {
      CreationTime: { [Op.gte]: dayCompare },
      BookingUserId: id,
    },
  });

  if (amountOrderByCategory > 0) {
    throw new ApiError(
      500,
      "Không thể xóa tài khoản vì có đơn hàng trong vòng 120 ngày gần nhất!"
    );
  }

  amountOrderByCategory = await DeviceBooking.count({
    where: {
      CreationTime: { [Op.gte]: dayCompare },
      BookingUserId: id,
    },
  });

  if (amountOrderByCategory > 0) {
    throw new ApiError(
      500,
      "Không thể xóa tài khoản vì có đơn hàng trong vòng 120 ngày gần nhất!"
    );
  }

  await BookingUser.update(
    {
      TenantId: null,
      Email: null,
      Username: null,
      Phone: null,
      HashPassword: null,
      Salt: null,
      Fullname: null,
      Image: null,
      FacebookId: null,
      GoogleName: null,
      FacebookToken: null,
      FacebookFirstname: null,
      FacebookLastname: null,
      FacebookEmail: null,
      FacebookPicture: null,
      GoogleName: null,
      GooglePicture: null,
      UserTypeId: null,
      IsDeleted: true,
      LastModifierUserId: id,
      DeleterUserId: id,
      DeletionTime: new Date(),
      AppleEmail: null,
      AppleFamilyName: null,
      AppleUserIdentifier: null,
      TokenEmail: null,
      IsActiveEmail: false,
      VerifyCode: false,
    },
    { where: { Id: id, IsDeleted: false } }
  );
  res.status(200).send({ success: true });
});

exports.likeStudioPost = catchAsync(async (req, res) => {
  const { PostId, CategoryId } = req.body;
  const UserId = req.user.id;
  let data, post, liked;
  switch (+CategoryId) {
    case 1:
      liked = await StudioPost_User.findAll({
        where: { StudioPostId: PostId, UserId },
      });
      if (liked.length > 0) {
        await StudioPost_User.destroy({
          where: { StudioPostId: PostId, UserId },
        });
      } else {
        data = await StudioPost_User.create({ StudioPostId: PostId, UserId });
      }
      createWebHookEvents(req, { Data: data });
      createWebHookSendAttempts();
      post = await StudioPost.findOne({
        where: {
          id: PostId,
        },
        include: {
          model: StudioPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;
    case 2:
      liked = await PhotographerPost_User.findAll({
        where: { PhotographerPostId: PostId, UserId },
      });
      if (liked.length > 0) {
        await PhotographerPost_User.destroy({
          where: { PhotographerPostId: PostId, UserId },
        });
      } else {
        data = await PhotographerPost_User.create({
          PhotographerPostId: PostId,
          UserId,
        });
      }

      createWebHookEvents(req, { Data: data });
      createWebHookSendAttempts();
      post = await PhotographerPost.findOne({
        where: {
          id: PostId,
        },
        include: {
          model: PhotographerPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;
    case 3:
      liked = await ClothesPost_User.findAll({
        where: { ClothesPostId: PostId, UserId },
      });
      if (liked.length > 0) {
        await ClothesPost_User.destroy({
          where: { ClothesPostId: PostId, UserId },
        });
      } else {
        data = await ClothesPost_User.create({
          ClothesPostId: PostId,
          UserId,
        });
      }

      createWebHookEvents(req, { Data: data });
      createWebHookSendAttempts();
      post = await ClothesPost.findOne({
        where: {
          id: PostId,
        },
        include: {
          model: ClothesPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;
    case 4:
      liked = await MakeupPost_User.findAll({
        where: { MakeupPostId: PostId, UserId },
      });
      if (liked.length > 0) {
        await MakeupPost_User.destroy({
          where: { MakeupPostId: PostId, UserId },
        });
      } else {
        data = await MakeupPost_User.create({
          MakeupPostId: PostId,
          UserId,
        });
      }

      createWebHookEvents(req, { Data: data });
      createWebHookSendAttempts();
      post = await MakeupPost.findOne({
        where: {
          id: PostId,
        },
        include: {
          model: MakeupPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;
    case 5:
      liked = await DevicePost_User.findAll({
        where: { DevicePostId: PostId, UserId },
      });
      if (liked.length > 0) {
        await DevicePost_User.destroy({
          where: { DevicePostId: PostId, UserId },
        });
      } else {
        data = await DevicePost_User.create({
          DevicePostId: PostId,
          UserId,
        });
      }

      createWebHookEvents(req, { Data: data });
      createWebHookSendAttempts();
      post = await DevicePost.findOne({
        where: {
          id: PostId,
        },
        include: {
          model: DevicePost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;
    case 6:
      liked = await ModelPost_User.findAll({
        where: { ModelPostId: PostId, UserId },
      });
      if (liked.length > 0) {
        await ModelPost_User.destroy({
          where: { ModelPostId: PostId, UserId },
        });
      } else {
        data = await ModelPost_User.create({
          ModelPostId: PostId,
          UserId,
        });
      }

      createWebHookEvents(req, { Data: data });
      createWebHookSendAttempts();
      post = await ModelPost.findOne({
        where: {
          id: PostId,
        },
        include: {
          model: ModelPost_User,
          as: "UsersLiked",
          attributes: ["UserId"],
        },
      });
      break;

    default:
      break;
  }
  // const postLiker = post.reduce(
  //   (acc, val) => {
  //     return {
  //       ...val.toJSON(),
  //       BookingUser: null,
  //       BookingUsers: [...acc.BookingUsers, val.toJSON().BookingUser],
  //     };
  //   },
  //   { BookingUsers: [] }
  // );
  res.status(200).json({
    success: "true",
    data: ImageListDestructure([
      { ...post.dataValues, category: CategoryId },
    ])[0],
  });
});

exports.getLikedPostByUserId = catchAsync(async (req, res) => {
  const { CategoryId } = req.body;
  const UserId = req.user.id;
  const sort = req.query._sort
    ? { order: [["createdAt", req.query._sort]] }
    : null;
  let post = [];
  let post1 = await StudioPost_User.findAll({
    where: {
      UserId,
    },
    sort,
    attributes: ["StudioPostId"],
    include: {
      model: StudioPost,
      as: "Post",
    },
  });
  let post2 = await PhotographerPost_User.findAll({
    where: {
      UserId,
    },
    sort,
    attributes: ["PhotographerPostId"],
    include: {
      model: PhotographerPost,
      as: "Post",
    },
  });
  let post3 = await ClothesPost_User.findAll({
    where: {
      UserId,
    },
    sort,
    attributes: ["ClothesPostId"],
    include: {
      model: ClothesPost,
      as: "Post",
    },
  });
  let post4 = await MakeupPost_User.findAll({
    where: {
      UserId,
    },
    sort,
    attributes: ["MakeupPostId"],
    include: {
      model: MakeupPost,
      as: "Post",
    },
  });
  let post5 = await DevicePost_User.findAll({
    where: {
      UserId,
    },
    sort,
    attributes: ["DevicePostId"],
    include: {
      model: DevicePost,
      as: "Post",
    },
  });
  let post6 = await ModelPost_User.findAll({
    where: {
      UserId,
    },
    sort,
    attributes: ["ModelPostId"],
    include: {
      model: ModelPost,
      as: "Post",
    },
  });

  // let Posts = post
  //   .concat(post1)
  //   .concat(post2)
  //   .concat(post3)
  //   .concat(post4)
  //   .concat(post5)
  //   .concat(post6)
  //   ?.reduce((acc, val) => [...acc, val.toJSON().Post], []);
  let posts = [];
  posts = ImageListDestructure(
    posts
      .concat(post1)
      .reduce((acc, val) => [...acc, val.toJSON().Post], [])
      .map((val) => ({
        ...val,
      }))
  );
  res.status(200).json({
    success: "true",
    studio: ImageListDestructure(
      post1
        .reduce((acc, val) => [...acc, val.toJSON().Post], [])
        .map((val) => ({
          ...val,
        }))
    ),
    photographers: ImageListDestructure(
      post2
        .reduce((acc, val) => [...acc, val.toJSON().Post], [])
        .map((val) => ({
          ...val,
        }))
    ),
    clothes: ImageListDestructure(
      post3
        .reduce((acc, val) => [...acc, val.toJSON().Post], [])
        .map((val) => ({
          ...val,
        }))
    ),
    makeups: ImageListDestructure(
      post4
        .reduce((acc, val) => [...acc, val.toJSON().Post], [])
        .map((val) => ({
          ...val,
        }))
    ),
    devices: ImageListDestructure(
      post5
        .reduce((acc, val) => [...acc, val.toJSON().Post], [])
        .map((val) => ({
          ...val,
        }))
    ),
    models: ImageListDestructure(
      post6
        .reduce((acc, val) => [...acc, val.toJSON().Post], [])
        .map((val) => ({
          ...val,
        }))
    ),
  });
});

exports.socialAccountLink = catchAsync(async (req, res) => {
  const { providerId } = req.body;
  const id = req.user.id;
  const photoUrl = req.body.auth?.currentUser.photoURL;
  const uid = req.body.auth?.currentUser.uid;
  const email = req.body.auth?.currentUser.email || req.body?.email;
  const displayName = req.body.auth?.currentUser.displayName;
  let checkEmail;
  if (providerId === "facebook.com") {
    checkEmail = await BookingUser.findAll({
      where: { IsDeleted: false, FacebookEmail: email },
    });
  } else if (providerId === "google.com") {
    checkEmail = await BookingUser.findAll({
      where: { IsDeleted: false, GoogleEmail: email },
    });
  }
  if (checkEmail.length > 0) {
    throw new ApiError(404, "Tài khoản đã được liên kết!");
  }
  const user = await BookingUser.findByPk(id, { where: { IsDeleted: false } });
  if (!user) {
    throw new ApiError(404, "Tài khoản không tồn tại!");
  }

  let Fullname,
    FacebookId,
    FacebookToken,
    FacebookFirstname,
    FacebookLastname,
    FacebookEmail,
    FacebookPicture,
    GoogleEmail,
    GoogleName,
    GooglePicture;

  if (providerId === "facebook.com") {
    FacebookId = uid;
    FacebookToken = null;
    FacebookFirstname = displayName || req.body.firstName;
    FacebookLastname = displayName || req.body.lastName;
    Fullname = displayName || req.body.displayName;
    FacebookEmail = email;
    FacebookPicture = photoUrl || req.body.photoUrl;
  } else if (providerId === "google.com") {
    if (user.dataValues.GoogleEmail) {
      throw new ApiError(404, "Tài khoản đã liên kết google!");
    }
    GoogleEmail = email;
    GoogleName = displayName;
    GooglePicture = photoUrl;
  }

  const data = {
    // Email: GoogleEmail || null,
    FacebookId: FacebookId || user.dataValues.FacebookId,
    FacebookFirstname: FacebookFirstname || user.dataValues.FacebookFirstname,
    FacebookLastname: FacebookLastname || user.dataValues.FacebookLastname,
    FacebookEmail: FacebookEmail || user.dataValues.FacebookEmail,
    FacebookPicture: FacebookPicture || user.dataValues.FacebookPicture,
    GoogleEmail: GoogleEmail || user.dataValues.GoogleEmail,
    GoogleName: GoogleName || user.dataValues.GoogleName,
    GooglePicture: GooglePicture || user.dataValues.GooglePicture,
  };
  await BookingUser.update(
    { ...data },
    {
      where: {
        Id: id,
      },
    }
  );

  const newUser = await BookingUser.findByPk(id, {
    where: { IsDeleted: false },
  });
  res.status(201).json({
    success: true,
    data: newUser,
  });
});

exports.cancelSocialAccountLink = catchAsync(async (req, res) => {
  const { providerId } = req.body;
  const id = req.user.id;

  const user = await BookingUser.findByPk(id, { where: { IsDeleted: false } });
  if (!user) {
    throw new ApiError(404, "User is not exist!");
  }

  let FacebookId,
    FacebookToken,
    FacebookFirstname,
    FacebookLastname,
    FacebookEmail,
    FacebookPicture,
    GoogleEmail,
    GoogleName,
    GooglePicture;

  if (providerId === "facebook.com") {
    FacebookId = null;
    FacebookToken = null;
    FacebookFirstname = null;
    FacebookLastname = null;
    FacebookEmail = null;
    FacebookPicture = null;
  } else if (providerId === "google.com") {
    GoogleEmail = null;
    GoogleName = null;
    GooglePicture = null;
  }

  const data = {
    // Email: GoogleEmail,
    Fullname: user.dataValues.Fullname,
    // Image: null,
    FacebookId: FacebookId,
    FacebookToken: FacebookToken,
    FacebookFirstname: FacebookFirstname,
    FacebookLastname: FacebookLastname,
    FacebookEmail: FacebookEmail,
    FacebookPicture: FacebookPicture,
    GoogleEmail: GoogleEmail,
    GoogleName: GoogleName,
    GooglePicture: GooglePicture,
  };

  await BookingUser.update(data, {
    where: {
      Id: id,
    },
  });
  const newUser = await BookingUser.findByPk(id, {
    where: { IsDeleted: false },
  });
  res.status(201).json({
    success: true,
    data: newUser,
  });
});

exports.verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.params;
  const bookingUser = await BookingUser.findOne({
    where: { TokenEmail: token },
  });
  if (!bookingUser) {
    throw new ApiError(400, "This email is activated");
  }
  let user;
  try {
    user = jwt.verify(token, process.env.SECRET);
  } catch (error) {
    if ((error.name = "TokenExpiredError")) {
      throw new ApiError(401, "Token is expired");
    }
    throw new ApiError(401, "Unauthoriezed");
  }
  await BookingUser.update(
    { TokenEmail: null, IsActiveEmail: true },
    { where: { Id: user.id } }
  );
  const tokenlogin = jwt.sign(
    {
      id: bookingUser.dataValues.id,
      Email: bookingUser.dataValues.Email,
      Fullname: bookingUser.dataValues.Fullname,
    },
    process.env.SECRET,
    {
      expiresIn: 86164,
    }
  );
  res.status(200).json({
    success: "true",
    token: tokenlogin,
    data: bookingUser,
  });
});

exports.genCode = catchAsync(async (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  let token;
  if (req.body.UserId) {
    token = jwt.sign(
      {
        id: req.body.UserId || +process.env.DEFAULT_USER,
        Email: req.body.Email,
      },
      process.env.SECRET,
      {
        expiresIn: process.env.TOKEN_EMAIL_EXPIRE,
      }
    );
    await BookingUser.update(
      { VerifyCode: code, TokenEmail: token },
      { where: { Id: req.body.UserId } }
    );
  } else {
    token = jwt.sign(
      {
        id: +process.env.DEFAULT_USER,
        Email: req.body.Email,
      },
      process.env.SECRET,
      {
        expiresIn: process.env.TOKEN_EMAIL_EXPIRE,
      }
    );
    const check = await BookingUser.findOne({
      where: {
        Email: req.body.Email,
      },
    });

    if (check) {
      await BookingUser.update(
        { VerifyCode: code, TokenEmail: token },
        { where: { id: check.dataValues.id } }
      );
    } else {
      await BookingUser.create({
        Email: req.body.Email,
        VerifyCode: code,
        TokenEmail: token,
        CreatedDate: moment(),
        UpdatedDate: moment(),
        Status: 2,
        UpdatedBy: 1,
        CreationTime: moment(),
        IsDeleted: 0,
        Fullname: req.body.Fullname,
      });
    }
  }
  const EmailData = [
    {
      key: "<!-- Code -->",
      value: code,
    },
    {
      key: "<!-- Email -->",
      value: req.body.Email,
    },
  ];

  baseController.sendHTMLmail(2, req.body.Email, EmailData);
  res.status(200).send({ success: true, msg: "Generate code success!" });
});

exports.checkCode = catchAsync(async (req, res) => {
  const VerifyCode = req.body.VerifyCode;
  const isUpdate = req.body.isUpdate;
  let user;

  if (req?.body?.UserId) {
    user = await BookingUser.findByPk(req.body.UserId);
  } else {
    user = await BookingUser.findOne({
      where: { Email: req.body.Email },
    });
  }

  if (VerifyCode !== user.dataValues.VerifyCode)
    throw new ApiError(400, "Wrong code");

  let check;
  try {
    check = jwt.verify(user.dataValues.TokenEmail, process.env.SECRET);
  } catch (error) {
    if ((error.name = "TokenExpiredError")) {
      throw new ApiError(401, "Token is expired");
    }
    throw new ApiError(401, "Unauthoriezed");
  }
  await BookingUser.update(
    { VerifyCode: null, TokenEmail: null, IsActiveEmail: isUpdate ? 0 : 1 },
    { where: { Id: req?.body?.UserId || +process.env.DEFAULT_USER } }
  );
  const tokenlogin = jwt.sign(
    {
      id: user.dataValues.id,
      Email: user.dataValues.Email,
      Fullname: user.dataValues.Fullname,
    },
    process.env.SECRET,
    {
      expiresIn: 86164,
    }
  );
  res
    .status(200)
    .send({ success: true, msg: "Valid code!", token: tokenlogin });
});

exports.zaloLink = catchAsync(async (req, res) => {
  const userId = req.user.id;
  let { zaloId, zaloName, zaloPicture } = req.body;
  const checkZaloLink = await BookingUser.findOne({
    where: { ZaloId: zaloId, Id: { [Op.ne]: userId } },
  });
  if (checkZaloLink) {
    throw new ApiError(404, "Account was used to link!");
  }
  let user = await BookingUser.findByPk(userId);
  if (user.dataValues.ZaloId) {
    zaloId = null;
    zaloName = null;
    zaloPicture = null;
  }
  const temp = await BookingUser.update(
    {
      ZaloId: zaloId,
      ZaloName: zaloName,
      ZaloPicture: zaloPicture,
    },
    { where: { Id: userId } }
  );
  user = await BookingUser.findByPk(userId);
  res.status(200).send({ success: true, data: user });
});
