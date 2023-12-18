const {
  AdminAccount,
  ConversationsUsers,
  MessagesUser,
  AppBinaryObject,
} = require("../../models");
const ApiError = require("../ApiError");

class ChatSocketControllerClass {
  constructor() {}

  joinRoom(socket, { roomId, memberId }) {
    /**
     * Member join into room with roomId
     * if assignAdmin is true then create new ConversationUser and find the least conversation
     *    joined admin to assign to a new conversation
     *
     * Input:
     *    socket: socket
     *    roomId: int
     *    memberId: int
     *
     * Output: None
     */
    socket.join(roomId);

    console.log(`User ${memberId} has joined room ${roomId}`);
  }

  async sendMessageAdmin(messageInfo) {
    const { ConversationId, Chatting, Content, Type } =
      messageInfo.messageContent;
    const { From, With } = messageInfo;

    let PartnerId, CustomerId, AdminId;
    try {
      const conversation = await ConversationsUsers.findByPk(ConversationId);

      //*** Error Catching ***/
      if (!conversation) {
        throw new ApiError(500, "Conversation does not exist");
      }
      if (Chatting === "" || Chatting === null || Chatting === undefined) {
        throw new ApiError(500, "Sender's info field is required");
      }
      //**********************/
      if (Content === "Xin chào chúng tôi có thể giúp được gì cho bạn !") {
        CustomerId = -1;
        AdminId = conversation.dataValues.AdminId;
      } else {
        switch (From) {
          case "user":
            PartnerId = null;
            if (With === "admin") {
              CustomerId = Chatting?.id;
              AdminId = -1;
            } else {
              CustomerId = -1;
              AdminId = conversation.dataValues.AdminId;
            }
            break;

          case "partner":
            CustomerId = null;
            if (With === "admin") {
              PartnerId = Chatting?.id;
              AdminId = -1;
            } else {
              PartnerId = -1;
              AdminId = conversation.dataValues.AdminId;
            }
            break;

          case "admin":
            if (With === "user||partner") {
              PartnerId = -1;
              CustomerId = -1;
              AdminId = conversation.dataValues.AdminId;
            }
            break;
        }
      }

      // *** Create message in database ***
      const handle = async () => {
        if (Type !== "text") {
          const img = await AppBinaryObject.create({
            Bytes: Content,
            Description: messageInfo.messageContent.fileName,
          });
          console.log("Newly create image:", img.toJSON());
          const data = await MessagesUser.create({
            ConversationId,
            PartnerId,
            UserId: CustomerId,
            AdminId,
            fileName: messageInfo.messageContent.fileName,
            Content: img.toJSON().Id,
            Type,
          });
          return data;
        } else {
          const data = await MessagesUser.create({
            ConversationId,
            Content,
            PartnerId,
            UserId: CustomerId,
            AdminId,
            Type,
          });
          return data;
        }
      };
      const data = await handle();
      //**********************/

      // *** Update message count ***
      const messagesCount = await MessagesUser.count({
        where: {
          ConversationId,
        },
      });
      await ConversationsUsers.update(
        { NoOfMessage: messagesCount },
        {
          where: {
            id: ConversationId,
          },
        }
      );

      //**********************/
      return {
        ...messageInfo,
        messageContent: {
          id: data.dataValues.id,
          ConversationId: data.dataValues.ConversationId,
          createdAt: data.dataValues.createdAt,
          Content: data.dataValues.Content,
          Chatting: Chatting,
          sender: From,
          Type: Type,
        },
      };
    } catch (err) {
      console.error(err);
    }
  }

  async sendMessage(io, messageInfo) {
    const { ConversationId, Content, Chatting, Type } = messageInfo;

    //Kiểm tra xem conversation này đã gửi tin chào mừng chưa
    //1 tin xin chào này chỉ gửi 1 lần
    if (Content === "Xin chào chúng tôi có thể giúp được gì cho bạn !") {
      const check = await MessagesUser.findOne({
        where: {
          ConversationId,
          PartnerId: Chatting.id,
        },
      });
      if (check) {
        return;
      }
    }

    let PartnerId,
      UserId,
      AdminId = null;
    try {
      const conversation = await ConversationsUsers.findByPk(ConversationId);

      if (!conversation) {
        throw new ApiError(500, "conversation does not exist");
      }
      if (Chatting === "" || Chatting === null || Chatting === undefined) {
        throw new ApiError(500, "field Chatting is required");
      }

      if (
        Object.keys(Chatting).includes("PartnerName") &&
        Object.keys(Chatting).includes("PartnerName") !== undefined
      ) {
        PartnerId = Chatting?.id;
        UserId = -1;
      } else {
        PartnerId = -1;
        UserId = Chatting?.id;
      }

      const handle = async () => {
        if (Type !== "text") {
          const img = await AppBinaryObject.create({
            Bytes: Content,
            Description: messageInfo.fileName,
          });
          const data = await MessagesUser.create({
            ConversationId,
            PartnerId,
            AdminId,
            fileName: messageInfo.fileName,
            Content: img.toJSON().Id,
            UserId,
            Type,
          });
          return data;
        } else {
          const data = await MessagesUser.create({
            ConversationId,
            Content,
            PartnerId,
            AdminId,
            UserId,
            Type,
          });
          return data;
        }
      };
      const data = await handle();
      const messagesCount = await MessagesUser.count({
        where: {
          ConversationId,
        },
      });
      await ConversationsUsers.update(
        { NoOfMessage: messagesCount },
        {
          where: {
            id: ConversationId,
          },
        }
      );

      // return {
      //   id: data.dataValues.id,
      //   ConversationId: data.dataValues.ConversationId,
      //   createdAt: data.dataValues.createdAt,
      //   Content: data.dataValues.Content,
      //   Chatting: Chatting,
      //   Type: Type,
      // };

      return {
        ...messageInfo, // From and With, "partner" || "user"
        messageContent: {
          id: data.dataValues.id,
          ConversationId: data.dataValues.ConversationId,
          createdAt: data.dataValues.createdAt,
          Content: data.dataValues.Content,
          Chatting: Chatting,
          sender: From,
          Type: Type,
        },
      };
    } catch (err) {
      console.error(err);
    }
  }
}

exports.chatSocketControllerInstance = new ChatSocketControllerClass();
