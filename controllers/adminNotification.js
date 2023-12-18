const { AdminNotification } = require("../models");
const { AppBinaryObject } = require("../models");
const { NotificationToken } = require("../models");
const { RegisterPartner } = require("../models");
const { BookingUser } = require("../models");
const baseController = require("../utils/BaseController");
const catchAsync = require("../middlewares/async");
const ApiError = require("../utils/ApiError");
const { Op } = require("sequelize");
const moment = require("moment");
const { sendAndroid, sendIOS } = require("../utils/pushMessage");
const schedule = require("node-schedule");

exports.getAllNotification = catchAsync(async (req, res) => {
  const { page, limit, option } = req.query;
  let data;
  if (option === null || +option === 1 || +option === 0) {
    data = await baseController.Pagination(AdminNotification, page, limit, {
      where: {
        Exception: {
          [Op.like]: `%:${option}%`,
        },
      },
    });
  } else {
    data = await baseController.Pagination(AdminNotification, page, limit);
  }
  res.status(200).json(data);
});

exports.createNotification = catchAsync(async (req, res) => {
  const { Title, Content, Type, SendingTime, Exception } = req.body;
  const Image = req.file ? req.file : null;
  let Status = 0;
  const checking = Exception.split(":");
  if (
    checking.length > 2 ||
    // !checking[0] ||
    !checking[1] ||
    Number(checking[1]) > 1 ||
    Number(checking[1]) < 0
  ) {
    throw new ApiError(500, "Wrong notification exception format");
  }
  if (Type > 3 || Type < 0) {
    throw new ApiError(500, "Wrong type format (0,1,2,3)");
  }
  Status = 1;
  // if (!SendingTime) {
  // }
  // if (new Date(SendingTime) > new Date()) {
  //   Status = 1;
  // } else {
  //   Status = 0;
  // }

  const ImageNotification = await AppBinaryObject.create({
    Bytes: Image.buffer,
    Description: "notification" + Image.originalname,
  });
  const notificationCreation = await AdminNotification.create({
    Title,
    Content,
    Status,
    Type,
    Image: ImageNotification.Id,
    SendingTime,
    Exception,
  });

  // if (Exception.split(":")[1] === "1") {
  //   const NotificationTokens = await NotificationToken.findAll({
  //     where: {
  //       UserId: {
  //         [Op.not]:
  //           notificationCreation.dataValues.Exception.split(":")[0].split(","),
  //       },
  //     },
  //   });
  //   const notificationData = NotificationTokens.map((val, idx) => {
  //     return val.dataValues;
  //   });
  //   const android = notificationData
  //     .filter((val) => val.Token.length > 65)
  //     .map((val) => val.Token);
  //   const ios = notificationData
  //     .filter((val) => val.Token.length < 65)
  //     .map((val) => val.Token);
  //   if (moment(notificationCreation.dataValues.SendingTime) <= moment()) {
  //     if (android.length) {
  //       await sendAndroid(
  //         [
  //           "cLpHE1LaT82UZHT271FpuQ:APA91bEbjklnyZbl1C4rBv6JZ-q-LPTYuFL0YTP9NWmAEjZ9cFslML6TdbNbv2DEnKuFh33LHAuLkUyLVogZFqessi8efusIEj6ymqLEN4RZXvObAeveG6tC5t_-Gy4DA9ogGay7PEwP",
  //         ],
  //         notificationCreation.dataValues.Title
  //       );
  //     }
  //     if (ios.length) {
  //       await sendIOS(
  //         [
  //           "e04fe28d6efa9b9a8865059b4c586cf16461dc6c9c06b24296f9837b5b48d370",
  //           "b7ff0edfabf7b695f5cd315622f0072c7ce1e5ba0ecb4076f6abf2387ca08f80",
  //           "e0d4d0e2a4ad21de0411de80e773411e2a4e20fdbd227ed3ee1369e9c248325b",
  //         ],
  //         notificationCreation.dataValues.Title
  //       );
  //     }
  //   } else {
  //     const sendingValue = moment(
  //       notificationCreation.dataValues.SendingTime.toISOString()
  //     ).format("YYYY-MM-DD HH:mm:ss");
  //     const completedTaskSchedule = schedule.scheduleJob(
  //       {
  //         date: moment(sendingValue).date(),
  //         month: moment(sendingValue).month(),
  //         year: moment(sendingValue).year(),
  //         hour: moment(sendingValue).hours(),
  //         minute: moment(sendingValue).minutes(),
  //       },
  //       async () => {
  //         const checkingStatus = await AdminNotification.findByPk(
  //           notificationCreation.dataValues.id
  //         );
  //         if (android.length && checkingStatus.dataValues.Status !== 2) {
  //           await sendAndroid(
  //             [
  //               "fFTWmQN3TICS86ih9HEWzT:APA91bFa8ZPuSeTROgmGlmjpH4GHkJRBKaCT60Ij66D2hp4X8p6Wi96XjCWnrYUhEyxxuMnVw2V9gEbq7CUp8kq6zqclPlhxsPDKxNYhk_NDCE08wQ0oyTpmnO6J2WEhFpy11QSyn7GvcLpHE1LaT82UZHT271FpuQ:APA91bEbjklnyZbl1C4rBv6JZ-q-LPTYuFL0YTP9NWmAEjZ9cFslML6TdbNbv2DEnKuFh33LHAuLkUyLVogZFqessi8efusIEj6ymqLEN4RZXvObAeveG6tC5t_-Gy4DA9ogGay7PEwP",
  //             ],
  //             notificationCreation.dataValues.Title
  //           );
  //         }
  //         if (ios.length && checkingStatus.dataValues.Status !== 2) {
  //           await sendIOS(
  //             [
  //               "b7ff0edfabf7b695f5cd315622f0072c7ce1e5ba0ecb4076f6abf2387ca08f80",
  //               "e04fe28d6efa9b9a8865059b4c586cf16461dc6c9c06b24296f9837b5b48d370",
  //               "e0d4d0e2a4ad21de0411de80e773411e2a4e20fdbd227ed3ee1369e9c248325b",
  //             ],
  //             notificationCreation.dataValues.Title
  //           );
  //         }
  //         notificationCreation.Status = 0;
  //         await notificationCreation.save();
  //         if (notificationCreation.Status === 0) {
  //           completedTaskSchedule.cancel();
  //         }
  //       }
  //     );
  //   }
  // }
  res.status(200).send(notificationCreation);
});

exports.cancelNotification = catchAsync(async (req, res) => {
  const { id } = req.params;
  await AdminNotification.update(
    { Status: 2 },
    {
      where: {
        id,
        Status: {
          [Op.not]: 0,
        },
      },
    }
  );
  res.status(200).json({
    success: true,
    message: "Cancel success",
  });
});
exports.getNotificationById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await AdminNotification.findByPk(id);
  res.status(200).json({
    success: true,
    message: data,
  });
});

exports.filterNotification = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const { createdAt, sendingTime, status, type, userType } = req.body;
  if (userType === null || userType === undefined || userType === "") {
    throw new ApiError("404", "userType is require!");
  }
  let statusNoti = status.toString() === "0" ? true : status;
  const data = await baseController.Pagination(AdminNotification, page, limit, {
    where: {
      Exception: {
        [Op.substring]: `:${userType}`,
      },
      Status: statusNoti ? { [Op.eq]: status } : { [Op.not]: null },
      Type: type && type !== "" ? { [Op.eq]: type } : { [Op.not]: null },
      createdAt: {
        [Op.gte]: createdAt?.startDate
          ? moment(createdAt.startDate).startOf("date")
          : 1,
        [Op.lte]: createdAt?.endDate
          ? moment(createdAt.endDate).endOf("date")
          : moment(),
      },
      SendingTime: {
        [Op.gte]: sendingTime?.startDate
          ? moment(sendingTime.startDate).startOf("date")
          : 1,
        [Op.lte]: sendingTime?.endDate
          ? moment(sendingTime.endDate).endOf("date")
          : moment().add("years", 1),
      },
    },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({ ...data });
});

// ***************** Get Registered PARTNERS *****************
exports.getAllUser = catchAsync(async (req, res) => {
  const { option } = req.query;
  let data;
  if (option === "0") {
    data = await RegisterPartner.findAll();
  } else if (option === "1") {
    data = await BookingUser.findAll();
  } else {
    throw new ApiError(500, "Invalid option");
  }
  res.status(200).json(data);
});
