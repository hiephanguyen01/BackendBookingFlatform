const {
  RegisterPartner,
  StudioPost,
  AppBinaryObject,
  Bank,
  StudioBooking,
} = require("../models");
const { IdentifyImage } = require("../models");
const { createWebHook } = require("../utils/WebHook");
const baseController = require("../utils/BaseController");
const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

exports.getAllRegisterPartner = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const partner = await baseController.Pagination(RegisterPartner, page, limit);
  const data = {
    ...partner,
    data: await Promise.all(
      partner.data.map(async (val) => {
        const count = await StudioPost.count({
          where: { CreatorUserId: val.id },
        });
        return {
          id: val.id,
          IdentifierCode: `PAR-${("0000000000" + val.id).slice(-10)}`,
          Phone: val.Phone,
          Email: val.Email,
          NumberOfPost: count,
          CreationTime: val.CreationTime,
          LastModificationTime: val.LastModificationTime
            ? val.LastModificationTime
            : val.CreationTime,
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
exports.getPartnerById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const partner = await RegisterPartner.findByPk(id, {
    include: [{ model: Bank }],
  });
  if (!partner) {
    throw new ApiError(404, "Partner not found!");
  }

  const data = {
    IdentifierCode: `PAR-${("0000000000" + partner.id).slice(-10)}`,
    NumberOfPost: partner.PostCount || 1,
    ...partner.dataValues,
    LastModificationTime: partner.LastModificationTime
      ? partner.LastModificationTime
      : partner.CreationTime,
  };
  res.status(200).json(data);
});
exports.updatePartnerById = catchAsync(async (req, res) => {
  const { id } = req.params;
  let { files } = req;
  const {
    IsDeleted,
    PartnerName,
    RepresentativeName,
    Phone,
    OtherPhone,
    Email,
    ReEmail,
    BusinessRegistrationLicenseNumber,
    Address,
    BankBranchName,
    BankAccount,
    BankAccountOwnerName,
    LastModificationTime,
    Note,
    Identity,
    PersonalIdentity,
  } = req.body;
  const partner = await RegisterPartner.findByPk(id);
  if (!partner) throw new ApiError(404, "Failed");
  if (files.ImageGPKD1 !== undefined) {
    if (!partner.dataValues.ImageGPKD1) {
      const ImageGPKD1 = await AppBinaryObject.create({
        Bytes: req.files.ImageGPKD1[0].buffer,
        description: `ImageGPKD1${req.files.ImageGPKD1[0].originalname}`,
      });
      await RegisterPartner.update(
        { ImageGPKD1: ImageGPKD1.dataValues.Id },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await AppBinaryObject.update(
        {
          Bytes: req.files.ImageGPKD1[0].buffer,
          description: `ImageGPKD1${req.files.ImageGPKD1[0].originalname}`,
        },
        {
          where: {
            Id: partner.dataValues.ImageGPKD1,
          },
        }
      );
    }
  }
  if (files.ImageGPKD2 !== undefined) {
    if (!partner.dataValues.ImageGPKD2) {
      const ImageGPKD2 = await AppBinaryObject.create({
        Bytes: req.files.ImageGPKD2[0].buffer,
        description: `ImageGPKD2${req.files.ImageGPKD2[0].originalname}`,
      });
      await RegisterPartner.update(
        { ImageGPKD2: ImageGPKD2.dataValues.Id },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await AppBinaryObject.update(
        {
          Bytes: req.files.ImageGPKD2[0].buffer,
          description: `ImageGPKD2${req.files.ImageGPKD2[0].originalname}`,
        },
        {
          where: {
            Id: partner.dataValues.ImageGPKD2,
          },
        }
      );
    }
  }
  if (files.ImageCCCD1 !== undefined) {
    if (!partner.dataValues.ImageCCCD1) {
      const ImageCCCD1 = await AppBinaryObject.create({
        Bytes: req.files.ImageCCCD1[0].buffer,
        description: `ImageCCCD1${req.files.ImageCCCD1[0].originalname}`,
      });
      await RegisterPartner.update(
        { ImageCCCD1: ImageCCCD1.dataValues.Id },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await AppBinaryObject.update(
        {
          Bytes: req.files.ImageCCCD1[0].buffer,
          description: `ImageCCCD1${req.files.ImageCCCD1[0].originalname}`,
        },
        {
          where: {
            Id: partner.dataValues.ImageCCCD1,
          },
        }
      );
    }
  }
  if (files.ImageCCCD2 !== undefined) {
    if (!partner.dataValues.ImageCCCD2) {
      const ImageCCCD2 = await AppBinaryObject.create({
        Bytes: req.files.ImageCCCD2[0].buffer,
        description: `ImageCCCD2${req.files.ImageCCCD2[0].originalname}`,
      });
      await RegisterPartner.update(
        { ImageCCCD2: ImageCCCD2.dataValues.Id },
        {
          where: {
            id,
          },
        }
      );
    } else {
      await AppBinaryObject.update(
        {
          Bytes: req.files.ImageCCCD2[0].buffer,
          description: `ImageCCCD2${req.files.ImageCCCD2[0].originalname}`,
        },
        {
          where: {
            Id: partner.dataValues.ImageCCCD2,
          },
        }
      );
    }
  }

  await RegisterPartner.update(
    {
      IsDeleted,
      PartnerName,
      RepresentativeName,
      Phone,
      OtherPhone,
      Email,
      ReEmail,
      BusinessRegistrationLicenseNumber,
      Address,
      BankBranchName,
      BankAccount,
      BankAccountOwnerName,
      LastModificationTime: Date.now(),
      Note,
      Identity,
      PersonalIdentity,
    },
    {
      where: {
        id,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "Update success",
  });
});
exports.filterPartner = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  let { CreateDate, updateDate, keyString, IsDeleted } = req.body;
  let condition;
  const regex = /(\d+)$/;
  if (keyString !== "") {
    keyString = keyString.replace(/\s+/g, "");
  }
  // if (CreateDate) CreationTime = JSON.parse(CreateDate);

  // if (updateDate) {
  //   updateDate = JSON.parse(updateDate);
  // }
  if (keyString !== "") {
    condition = {
      ...condition,
      [Op.or]: {
        Email: {
          [Op.like]: keyString ? `%${keyString}%` : "%",
        },
        Phone: {
          [Op.like]: keyString ? `%${keyString}%` : "%",
        },
        Id: {
          [Op.like]: keyString.match(regex)
            ? parseInt(keyString.match(regex)[1])
            : null,
        },
      },
    };
  }

  if (CreateDate?.startDate || CreateDate?.endDate) {
    condition = {
      ...condition,
      CreationTime: {
        [Op.or]: [
          {
            [Op.gte]: CreateDate?.startDate
              ? moment(CreateDate.startDate).utc().startOf("day")
              : 1,
            [Op.lte]: CreateDate?.endDate
              ? moment(CreateDate.endDate).utc().endOf("day")
              : moment().utc(),
          },
        ],
      },
    };
  }

  if (updateDate?.startDate || updateDate?.endDate) {
    condition = {
      ...condition,
      LastModificationTime: {
        [Op.or]: [
          {
            [Op.gte]: updateDate?.startDate
              ? moment(updateDate.startDate).utc().startOf("day")
              : 1,
            [Op.lte]: updateDate?.endDate
              ? moment(updateDate.endDate).utc().endOf("day")
              : moment().utc(),
          },
        ],
      },
    };
  }
  condition = {
    ...condition,
    IsDeleted: IsDeleted !== "" ? { [Op.in]: [IsDeleted] } : { [Op.notIn]: "" },
  };
  console.log(condition);
  const partner = await baseController.Pagination(
    RegisterPartner,
    page,
    limit,
    {
      where: condition,
    }
  );

  const data = {
    ...partner,
    data: partner.data.map((val) => {
      return {
        id: val.id,
        IdentifierCode: `PAR-${("0000000000" + val.id).slice(-10)}`,
        Phone: val.Phone,
        Email: val.Email,
        NumberOfPost: val.PostCount || 1,
        CreationTime: val.CreationTime,
        LastModificationTime: val.LastModificationTime
          ? val.LastModificationTime
          : val.CreationTime,
        IsDeleted: val.IsDeleted,
      };
    }),
  };
  return res.status(200).json({
    ...data,
  });
});
exports.getPartnerByTenantId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const partner = await RegisterPartner.findOne({
    where: { TenantId: id },
  });
  if (!partner) {
    throw new ApiError(404, "Partner not found!");
  }
  res.status(200).json(partner);
});
exports.searchRegisterPartner = catchAsync(async (req, res) => {
  //id is UserId
  const { id, keyword, forAdmin } = req.query;

  // Write function query record in table RegisterPartner if the PartnerName field contain keyword variable
  let data = null;
  if (forAdmin) {
    console.log("Called in admin");
    data = await RegisterPartner.findAll({
      where: {
        PartnerName: {
          [Op.like]: `%${keyword}%`,
        },
      },
      attributes: ["id", "TenantId", "PartnerName"],
    });
  } else {
    //find all User order
    const userOrders = await StudioBooking.findAll({
      where: {
        BookingUserId: id,
      },
      attributes: ["TenantId"],
    });

    let uniq = new Set([...userOrders.map((val) => val.dataValues.TenantId)]);
    uniq = Array.from(uniq);

    data = await RegisterPartner.findAll({
      where: {
        id: {
          [Op.in]: uniq,
        },
        PartnerName: {
          [Op.like]: `%${keyword}%`,
        },
      },
    });
  }
  res.json({
    success: true,
    message: "Successfully retrieve data",
    payload: data,
  });
});
exports.PartnerRegister = catchAsync(async (req, res) => {
  const { Email } = req.body;
  const check = await RegisterPartner.findOne({
    where: {
      Email,
    },
  });
  if (check) {
    throw new ApiError(500, "Email existed");
  }
  const user = await RegisterPartner.create({
    ...req.body,
    ReEmail: Email,
    IsVerifiedEmail: false,
    CreationTime: moment(),
    LastModificationTime: moment(),
    IsDeleted: 0,
  });
  const token = jwt.sign(user.dataValues, process.env.SECRET, {
    expiresIn: 86164,
  });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const tokenEmail = jwt.sign(
    {
      id: user.dataValues.id,
      Email: user.dataValues.email,
    },
    process.env.SECRET,
    {
      expiresIn: process.env.TOKEN_EMAIL_EXPIRE,
    }
  );
  await RegisterPartner.update(
    { verifyCode: code, tokenEmail, TenantId: user.dataValues.id },
    { where: { id: user.dataValues.id } }
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
  res.status(200).json({
    success: true,
    user,
    token,
  });
});
exports.PartnerLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await RegisterPartner.findOne({
    where: {
      Email: email,
      HashPassword: md5(password),
    },
  });

  if (!user) {
    throw new ApiError(404, "not found");
  }
  const token = jwt.sign(user.dataValues, process.env.SECRET, {
    expiresIn: 86164,
  });
  res.status(200).json({
    success: true,
    user,
    token,
  });
});
exports.updatePass = catchAsync(async (req, res) => {
  const Email = req.body.Email;
  const { password } = req.body;
  if (!password) {
    throw new ApiError(500, "Error");
  }
  await RegisterPartner.update(
    {
      HashPassword: md5(password),
    },
    {
      where: {
        Email,
      },
    }
  );
  res.json({
    success: true,
  });
});
exports.PartnerLoginMe = catchAsync(async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const data = jwt.verify(token, process.env.SECRET);
  const user = await RegisterPartner.findByPk(data.id);
  res.json({
    success: true,
    user: user,
  });
});
exports.genCodePartner = catchAsync(async (req, res) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await RegisterPartner.findOne({
    where: {
      Email: req.query.email,
    },
  });
  if (!user) throw new ApiError(404, "Wrong");
  const token = jwt.sign(
    {
      id: user.dataValues.id,
      Email: user.dataValues.email,
    },
    process.env.SECRET,
    {
      expiresIn: process.env.TOKEN_EMAIL_EXPIRE,
    }
  );
  await RegisterPartner.update(
    { verifyCode: code, tokenEmail: token, IsVerifiedEmail: false },
    { where: { id: user.dataValues.id } }
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
  const VerifyCode = req.body.VerifyCode;
  const user = await RegisterPartner.findOne({
    where: {
      Email: req.body.Email,
    },
  });

  if (!user) throw new ApiError(404, "Wrong");

  if (VerifyCode !== user.dataValues.verifyCode)
    throw new ApiError(400, "Wrong code");

  try {
    jwt.verify(user.dataValues.tokenEmail, process.env.SECRET);
  } catch (error) {
    if ((error.name = "TokenExpiredError")) {
      throw new ApiError(401, "Token is expired");
    }
    throw new ApiError(401, "Unauthoriezed");
  }
  await RegisterPartner.update(
    {
      verifyCode: null,
      tokenEmail: null,
      IsActiveEmail: 1,
    },
    {
      where: {
        id: user.dataValues.id,
      },
    }
  );
  res.status(200).send({ success: true, msg: "Valid code!" });
});
