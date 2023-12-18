const moment = require("moment");
const {
  AdminNotificationSig,
  ConversationsUsers,
  MessagesUser,
} = require("../models");
const { Op } = require("sequelize");
const ApiError = require("./ApiError");
const {
  getStudioPostIdByIdentifyCode,
} = require("../controllers/factoryController");
const {
  chatSocketControllerInstance,
} = require("./utils_class/ChatSocketControllerClass");
const {
  findConversationHasPartnerIdAndUserId,
  createConversationUserRawFunction,
  createMessageUserRawFunction,
} = require("../controllers/conversationUser");

function getCategoryValue(identifier) {
  try {
    const prefix = identifier?.slice(0, 4);
    const categoryByIdentyfy = {
      OSTD: 1,
      OPTG: 2,
      OCLT: 3,
      OMKP: 4,
      ODVC: 5,
      OMDL: 6,
    };
    return categoryByIdentyfy[prefix];
  } catch (error) {}
}

const users = {};
const partners = {};
const admins = {};

exports.socketNotification = (io) => {
  io.on("connection", async (socket) => {
    console.log("A socket connection was formed!!");

    socket.on("partnerJoinSocket", (TenantId) => {
      socket.join(String(TenantId)); //socket chỉ có thể nhận string k thể nhận number
    });

    socket.on("newUser", async (data) => {
      const newData = await AdminNotificationSig.create({
        title: "Có user mới",
        content: `${data.firstName} ${
          data.lastName
        } vừa tham gia lúc ${moment().format("DD/MM/YYYY HH:mm")}`,
        event: `/affiliate/manage/${data.id}`,
        category: 0,
        isReaded: false,
        type: "aff",
      });
      io.emit("recieveUser", newData);
    });

    socket.on("newBooking", async (data) => {
      const newData = await AdminNotificationSig.create({
        title: "Có đơn đặt mới",
        content: `Đơn đặt ${data?.IdentifyCode} được đặt lúc ${moment().format(
          "DD/MM/YYYY HH:mm"
        )} và có thể cập nhật đến ${moment()
          .add(15, "minutes")
          .format("DD/MM/YYYY HH:mm")} `,
        event: `/manage-order/edit/${data?.id || data?.Id}`,
        category: getCategoryValue(data?.IdentifyCode || 1),
        isReaded: false,
        type: "adm",
      });
      // socket.to(String(data.TenantId)).emit("receiveNotificationPartner", data);
      io.emit("recieveNotification", newData);
    });

    socket.on("updateEvidence", async (data) => {
      const newData = await AdminNotificationSig.create({
        title: "Có đơn đặt mới được cập nhật",
        content: `Đơn đặt ${
          data.IdentifyCode
        } được cập nhật minh chứng lúc ${moment().format(
          "DD/MM/YYYY HH:mm"
        )} vui lòng kiểm tra và chuyển trạng thái trước ${moment()
          .add(15, "minutes")
          .format("DD/MM/YYYY HH:mm")} `,
        event: `/manage-order/edit/${data.id}`,
        category: getCategoryValue(data?.IdentifyCode || 1),
        type: "adm",
        isReaded: false,
      });
      //dựa vào tenantId đã join để gửi cho partner
      // socket.to(String(data.TenantId)).emit("receiveNotificationPartner", data);
      //gửi cho admin
      io.emit("recieveNotification", newData);
    });

    socket.on("cancelBooking", async (data) => {
      const newData = await AdminNotificationSig.create({
        title: "Có đơn vừa được huỷ",
        content: `Đơn đặt ${
          data.IdentifyCode
        } vừa được huỷ vào lúc ${moment().format("DD/MM/YYYY HH:mm")}`,
        event: `/manage-order/edit/${data.id}`,
        category: getCategoryValue(data?.IdentifyCode || 1),
        isReaded: false,
        type: "adm",
        TenantId: data?.TenantId,
      });
      const postId = await getStudioPostIdByIdentifyCode(data?.IdentifyCode);
      const newDataPart = await AdminNotificationSig.create({
        title: "Có đơn vừa được huỷ",
        content: `Đơn đặt ${
          data.IdentifyCode
        } vừa được huỷ vào lúc ${moment().format("DD/MM/YYYY HH:mm")}`,
        event: postId,
        category: getCategoryValue(data?.IdentifyCode || 1),
        isReaded: false,
        type: "par",
        TenantId: data?.TenantId,
      });

      socket
        .to(String(data.TenantId))
        .emit("receiveNotificationPartner", newDataPart);

      io.emit("recieveNotification", newData);
    });

    socket.on("manualChangeBookingStatusByAdmin", async (data) => {
      const status = {
        2: "đã cọc",
        3: "đã thanh toán",
      };
      if (data?.PaymentStatus === 2) {
        const conversationId = await findConversationHasPartnerIdAndUserId(
          data["TenantId"],
          data["BookingUserId"]
        );
        if (conversationId !== null) {
          const message = await createMessageUserRawFunction(
            conversationId,
            "Xin chào chúng tôi có thể giúp được gì cho bạn !",
            1
          );
          // emit message to chat room
          io.to(conversationId).emit("receive_message", {
            From: "partner",
            With: "user",
            messageContent: {
              id: message.dataValues.id,
              ConversationId: conversationId,
              createdAt: message.dataValues.createdAt,
              Content: message.dataValues.Content,
              Chatting: { id: data["TenantId"] },
              sender: "partner",
              Type: "text",
            },
          });
        } else {
          const newConversation = await createConversationUserRawFunction(
            data["TenantId"],
            data["BookingUserId"],
            0
          );
          if (newConversation) {
            // create room then emit message to chat room
            const message = await createMessageUserRawFunction(
              newConversation.id,
              "Xin chào chúng tôi có thể giúp được gì cho bạn !",
              1
            );
            // emit message to chat room
            io.to(newConversation.id).emit("receive_message", {
              From: "partner",
              With: "user",
              messageContent: {
                id: message.dataValues.id,
                ConversationId: newConversation.id,
                createdAt: message.dataValues.createdAt,
                Content: message.dataValues.Content,
                Chatting: { id: data["TenantId"] },
                sender: "partner",
                Type: "text",
              },
            });
          }
        }
      } else {
        const postId = await getStudioPostIdByIdentifyCode(data?.IdentifyCode);
        const newDataPart = await AdminNotificationSig.create({
          title: "Bạn có đơn đặt mới !",
          content: `Đơn đặt ${data.IdentifyCode} được chuyển sang ${
            status[data?.PaymentStatus]
          }  vào lúc ${moment().format("DD/MM/YYYY HH:mm")} bởi quản trị viên`,
          event: postId,
          category: getCategoryValue(data?.IdentifyCode || 1),
          isReaded: false,
          type: "par",
          TenantId: data?.TenantId,
        });
        socket
          .to(String(data.TenantId))
          .emit("receiveNotificationPartner", newDataPart);
      }
    });

    socket.on("payment-status-update", async (data) => {
      const { IdentifyCode, PaymentStatus } = data;
      await StudioBooking.update(
        {
          PaymentStatus,
          IsPayDeposit: PaymentStatus === 2 || PaymentStatus === 3 ? 1 : 0,
        },
        { where: { IdentifyCode } }
      );
      io.emit("payment-status-update", "Changed Payment Status successfully");
    });

    // ************** Chat Between Customer and Partner **************
    socket.on("joinChatRoom", (args) => {
      // console.log(args);
      chatSocketControllerInstance.joinRoom(socket, args);
    });
    socket.on(
      "requestUserAndPartnerJoinRoom",
      ({ roomId, userId, partnerId }) => {
        io.emit("requestUserAndPartnerJoinRoom", { roomId, userId, partnerId });
      }
    );

    socket.on("login_admin", (admin) => {
      // ********* Check if any online user has a conversation with this partner  *********
      (async () => {
        const usersArray = Object.values(users).map((el) => [el]);
        const conversationsOfThisAdmin = await ConversationsUsers.findAll({
          where: {
            PartnerId: admin.adminId,
            UserId: {
              [Op.in]: usersArray,
            },
          },
          attributes: ["id"],
        });
        // console.log(conversationsOfThisAdmin);
        const userTemp = conversationsOfThisAdmin.reduce(
          (total, curr) => ({
            ...total,
            [socket.id]: curr.dataValues.id,
          }),
          {}
        );
        // console.log(userTemp);
        io.emit("online_user", Object.values(userTemp));
      })();
      admins[socket.id] = admin.adminId;
      socket.broadcast.emit("online_admin", Object.values(admins));
    });

    socket.on("login_user", (user) => {
      // console.log(
      //   `A socket connection was formed in login user socket for userId ${user.userId}!!`
      // );
      // users[socket.id] = user.userId;
      // io.emit("online_partner", Object.values(partners));
      // io.emit("online_admin", Object.values(admins));
    });

    socket.on("disconnect", (reason) => {
      delete users[socket.id];
      delete admins[socket.id];
      delete partners[socket.id];

      socket.broadcast.emit("offline_user", Object.values(users));
      socket.broadcast.emit("offline_partner", Object.values(partners));
      io.emit("offline_admin", Object.values(admins));
    });

    socket.on("login_partner", (partner) => {
      partners[socket.id] = partner.userId;
      io.emit("online_user", Object.values(users));
      socket.broadcast.emit("online_partner", Object.values(partners));
    });

    socket.on("send_message_admin", async (messageInfo) => {
      /**
       * Args: messageInfo: Object
       *
       * Return: None
       */
      const response_obj = await chatSocketControllerInstance.sendMessageAdmin(
        messageInfo
      );
      io.to(response_obj?.messageContent?.ConversationId).emit(
        "receive_message_admin",
        {
          ...response_obj,
        }
      );
    });

    socket.on("send_message", async (messageInfo) => {
      /**
       * Args: messageInfo: Object
       *
       * Return: None
       */
      const response_obj = await chatSocketControllerInstance.sendMessage(
        io,
        messageInfo
      );
      io.emit("receive_message", { ...response_obj });
    });
  });
};
