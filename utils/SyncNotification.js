const { Op } = require("sequelize");
const { AdminNotification, NotificationToken } = require("../models");
const { sendAndroid, sendIOS } = require("./pushMessage");
const moment = require("moment");

const sendingNotificationTask = async () => {
  const notification = await AdminNotification.findAll({
    where: {
      Status: 1,
    },
    raw: true,
  });
  await Promise.all(notification.map((noti) => checkNotificationandSend(noti)));
};

const checkNotificationandSend = async (notificationCreation) => {
  if (notificationCreation.Exception.split(":")[1] === "1") {
    const NotificationTokens = await NotificationToken.findAll({
      where: {
        UserId: {
          [Op.not]: notificationCreation.Exception.split(":")[0].split(","),
        },
      },
      raw: true,
    });
    const android = NotificationTokens.filter(
      (val) => val.Token.length > 65
    ).map((val) => val.Token);
    const ios = NotificationTokens.filter((val) => val.Token.length < 65).map(
      (val) => val.Token
    );
    if (moment(notificationCreation.SendingTime) <= moment()) {
      if (android.length) {
        await sendAndroid(
          [
            "cLpHE1LaT82UZHT271FpuQ:APA91bEbjklnyZbl1C4rBv6JZ-q-LPTYuFL0YTP9NWmAEjZ9cFslML6TdbNbv2DEnKuFh33LHAuLkUyLVogZFqessi8efusIEj6ymqLEN4RZXvObAeveG6tC5t_-Gy4DA9ogGay7PEwP",
          ],
          notificationCreation.Title
        );
      }
      if (ios.length) {
        await sendIOS(
          [
            "e04fe28d6efa9b9a8865059b4c586cf16461dc6c9c06b24296f9837b5b48d370",
            "b7ff0edfabf7b695f5cd315622f0072c7ce1e5ba0ecb4076f6abf2387ca08f80",
            "e0d4d0e2a4ad21de0411de80e773411e2a4e20fdbd227ed3ee1369e9c248325b",
          ],
          notificationCreation.Title
        );
      }
      await AdminNotification.update(
        { Status: 0 },
        {
          where: {
            id: notificationCreation.id,
          },
        }
      );
    }
  }
};

module.exports = sendingNotificationTask;
