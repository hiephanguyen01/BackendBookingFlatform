const md5 = require("md5");
const catchAsync = require("../middlewares/async");
const { AffiliateUser, AppBinaryObject } = require("../models");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const { Op, where } = require("sequelize");
const bcrypt = require("bcrypt");
const baseController = require("../utils/BaseController");

exports.all = catchAsync(async (req, res) => {
  const { keyString, isActivate } = req.query;
  let condition = {};
  if (keyString !== "") {
    condition = {
      ...condition,
      [Op.or]: [
        {
          email: {
            [Op.like]: keyString ? `%${keyString}%` : "`%%`",
          },
        },
        {
          firstName: {
            [Op.like]: keyString ? `%${keyString}%` : "`%%`",
          },
        },
        {
          lastName: {
            [Op.like]: keyString ? `%${keyString}%` : "`%%`",
          },
        },
        {
          phone: {
            [Op.like]: keyString ? `%${keyString}%` : "`%%`",
          },
        },
      ],
    };
  }
  if (isActivate !== "") {
    condition =
      isActivate === "1"
        ? { ...condition, isActivate: true }
        : { ...condition, isActivate: false };
  }

  const users = await AffiliateUser.findAll({
    where: condition,
    order: [["createdAt", "DESC"]],
  });
  res.json(users);
});
exports.details = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const user = await AffiliateUser.findByPk(userId);
  res.json(user);
});
exports.activate = catchAsync(async (req, res) => {
  const { option = "true" } = req.query;
  const { userId } = req.params;
  const user = await AffiliateUser.findByPk(userId);
  if (!user) {
    throw new ApiError(500, "wrong id");
  }
  await AffiliateUser.update(
    {
      isActivate: option === "true" ? !user.dataValues.isActivate : false,
    },
    {
      where: {
        id: userId,
      },
    }
  );

  const EmailData = [
    {
      key: "<!-- Role -->",
      value: user.dataValues.isActivateEmail ? "Email" : "Tên đăng nhập",
    },
    {
      key: "<!-- Account -->",
      value: user.dataValues.isActivateEmail
        ? user.dataValues.email
        : user.dataValues.phone,
    },
    {
      key: "<!-- IsEmail -->",
      value: user.dataValues.isActivateEmail
        ? ""
        : ` <li style=" font-size: 14px; line-height: 25.6px; text-align: left;">
              <span style="font-size: 16px; line-height: 25.6px; " >Mật khẩu: Không hiển thị vì lý do bảo mật</span>
            </li>`,
    },
  ];
  !user.dataValues.isActivate &&
    baseController.sendHTMLmail(6, user.dataValues.email, EmailData);
  res.json(true);
});
exports.me = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const data = jwt.verify(token, process.env.SECRET);
  const user = await AffiliateUser.findByPk(data.id);
  if (user === null) {
    throw new ApiError(404, "Failed");
  }
  res.json({
    success: true,
    user: user,
  });
});
exports.loginWithPhoneNumber = catchAsync(async (req, res) => {
  let { phone, password } = req.body;
  if (phone.includes("+84")) {
    phone = phone.split("+84")[1];
  }
  const user = await AffiliateUser.findOne({
    where: {
      phone,
      isDelete: false,
    },
  });
  if (!user) {
    throw new ApiError(404, "Sai thông tin đăng nhập vui lòng thử lại!");
  }
  const salt = user.dataValues.salt;
  const HashPassword = md5(password + salt);
  const checkPassword = HashPassword === user.dataValues.password;
  if (!checkPassword) {
    throw new ApiError(404, "Sai thông tin đăng nhập vui lòng thử lại!");
  }
  const token = jwt.sign(
    {
      id: user.dataValues.id,
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
exports.createUserPhoneNumber = catchAsync(async (req, res) => {
  let { phone, password } = req.body;
  let user, salt;
  phone = "0" + phone;
  const check = await AffiliateUser.findOne({
    where: { phone },
  });
  if (!phone || !password)
    throw new ApiError(500, "Hãy kiểm tra lại số điện thoại và mật khẩu");
  salt = bcrypt.genSaltSync(16);
  password = md5(password + salt);
  if (check) {
    await AffiliateUser.update(
      {
        salt,
        password,
      },
      {
        where: {
          id: check.dataValues.id,
        },
      }
    );
    user = check;
  } else {
    user = await AffiliateUser.create({
      phone,
      salt,
      password,
      isActivePhone: true,
      isDelete: false,
      isActivate: false,
      isPersonal: true,
      isRequired: true,
    });
  }
  const token = jwt.sign(
    {
      id: user.dataValues.id,
    },
    process.env.SECRET,
    {
      expiresIn: 86164,
    }
  );
  res.status(200).json({
    success: true,
    token,
  });
});
exports.userWithGoogle = catchAsync(async (req, res) => {
  const { email, firstName, lastName, fullName, photoUrl } =
    req.body._tokenResponse;
  let user;
  const isRegistered = await AffiliateUser.findOne({
    where: {
      googleEmail: email,
      isDelete: false,
    },
  });
  if (!isRegistered) {
    user = await AffiliateUser.create({
      email,
      firstName,
      lastName,
      fullName,
      googlePicture: photoUrl,
      googleEmail: email,
      googleName: fullName,
      isActivateEmail: true,
      isActivate: false,
      image: photoUrl,
      isDelete: false,
      isPersonal: true,
      isRequired: true,
    });
  } else {
    user = isRegistered;
  }
  const token = jwt.sign(
    {
      id: user.dataValues.id,
    },
    process.env.SECRET,
    {
      expiresIn: 86164,
    }
  );
  res.status(200).json({
    success: true,
    data: user,
    token,
  });
});
exports.userWithFacebook = catchAsync(async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    fullName,
    photoUrl,
    idToken,
    federatedId,
  } = req.body._tokenResponse;
  let user;
  const isRegistered = await AffiliateUser.findOne({
    where: {
      facebookId: federatedId.split("http://facebook.com/")[1],
      isDelete: false,
    },
  });
  if (!isRegistered) {
    user = await AffiliateUser.create({
      email,
      firstName,
      lastName,
      fullName,
      facebookPicture: photoUrl,
      facebookEmail: email,
      facebookFirstname: firstName,
      facebookLastname: lastName,
      facebookToken: idToken,
      facebookId: federatedId.split("http://facebook.com/")[1],
      isActivate: false,
      image: photoUrl,
      isDelete: false,
      isPersonal: true,
      isRequired: true,
    });
  } else {
    user = isRegistered;
  }
  const token = jwt.sign(
    {
      id: user.dataValues.id,
    },
    process.env.SECRET,
    {
      expiresIn: 86164,
    }
  );
  res.status(200).json({
    success: true,
    data: user,
    token,
  });
});
exports.updateUser = catchAsync(async (req, res) => {
  let phone;
  if (req.body?.email) {
    const check = await AffiliateUser.findOne({
      where: {
        email: req.body?.email,
        id: {
          [Op.not]: req.user.id,
        },
      },
    });
    if (check) throw new ApiError(500, "Email đã được sử dụng!");
  }
  if (req.body?.phone) {
    const check = await AffiliateUser.findOne({
      where: {
        phone: req.body?.phone,
        id: {
          [Op.not]: req.user.id,
        },
      },
    });
    if (check) throw new ApiError(500, "Số điện thoại đã được sử dụng!");
  }
  const user = await AffiliateUser.findByPk(req.user.id);
  if (req?.files?.CCCD1 !== undefined) {
    const CCCD1 = await AppBinaryObject.create({
      Bytes: req.files.CCCD1[0].buffer,
      description: `CCCD1${req.files.CCCD1[0].originalname}`,
    });
    await AffiliateUser.update(
      { CCCD1: CCCD1.dataValues.Id },
      {
        where: {
          id: req.user.id,
        },
      }
    );
  }
  if (req?.files?.CCCD2 !== undefined) {
    const CCCD2 = await AppBinaryObject.create({
      Bytes: req.files.CCCD2[0].buffer,
      description: `CCCD2${req.files.CCCD2[0].originalname}`,
    });
    await AffiliateUser.update(
      { CCCD2: CCCD2.dataValues.Id },
      {
        where: {
          id: req.user.id,
        },
      }
    );
  }
  await AffiliateUser.update(req.body, {
    where: {
      id: req.user.id,
    },
  });
  res.status(200).json({
    success: true,
  });
});
exports.genCode = catchAsync(async (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await AffiliateUser.findByPk(req.user.id);
  if (!user) throw new ApiError(404, "Wrong");
  const token = jwt.sign(
    {
      id: req.user.id,
      Email: user.dataValues.email,
    },
    process.env.SECRET,
    {
      expiresIn: process.env.TOKEN_EMAIL_EXPIRE,
    }
  );
  await AffiliateUser.update(
    { verifyCode: code, tokenEmail: token },
    { where: { id: req.user.id } }
  );
  const EmailData = [
    {
      key: "<!-- Code -->",
      value: code,
    },
    {
      key: "<!-- Email -->",
      value: user.dataValues.email,
    },
  ];

  baseController.sendHTMLmail(2, user.dataValues.email, EmailData);
  res.status(200).send({ success: true, msg: "Generate code success!" });
});
exports.checkCode = catchAsync(async (req, res) => {
  const VerifyCode = req.body.code;
  const userId = req.user.id;
  const user = await AffiliateUser.findByPk(userId);
  if (VerifyCode !== user.dataValues.verifyCode)
    throw new ApiError(400, "Wrong code");

  let check;
  try {
    check = jwt.verify(user.dataValues.tokenEmail, process.env.SECRET);
  } catch (error) {
    if ((error.name = "TokenExpiredError")) {
      throw new ApiError(401, "Token is expired");
    }
    throw new ApiError(401, "Unauthoriezed");
  }
  await AffiliateUser.update(
    { verifyCode: null, tokenEmail: null },
    { where: { Id: userId } }
  );
  res.status(200).send({ success: true, msg: "Valid code!" });
});
exports.sendRequest = catchAsync(async (req, res) => {
  const text = req.body.text;
  if (text.trim() === "") {
    throw new ApiError(500, "Vui lòng nhập nội dung!");
  }
  let textv;
  const { userId } = req.params;

  const user = await AffiliateUser.findByPk(userId);
  if (text.includes("\n")) {
    textv = text.split("\n").reduce(
      (acc, val) => `${acc} <li style="line-height: 25.6px;text-align: left;">
      <span style="font-size: 16px;line-height: 25.6px;">
      ${val}
      </span></li>`,
      ""
    );
  } else {
    textv = `<li style="line-height: 25.6px;text-align: left;">
      <span style="font-size: 16px;line-height: 25.6px;">
      ${text}
      </span></li>`;
  }
  const EmailData = [
    {
      key: "<!-- TEXT -->",
      value: textv,
    },
  ];

  baseController.sendHTMLmail(5, user.dataValues.email, EmailData);

  await AffiliateUser.update({ isRequired: true }, { where: { Id: userId } });

  res.status(200).send({ success: true });
});
