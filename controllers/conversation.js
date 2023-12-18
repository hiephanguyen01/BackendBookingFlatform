const {
  Conversation,
  ConversationsUsers,
  Message,
  MessagesUser,
  BookingUser,
  RegisterPartner,
} = require("../models");
const { createWebHook } = require("../utils/WebHook");
const ApiError = require("../utils/ApiError");
const baseController = require("../utils/BaseController");
const catchAsync = require("../middlewares/async");
const { Op } = require("sequelize");
const moment = require("moment");

exports.createConversation = catchAsync(async (req, res) => {
  const { withPartner, Chatter } = req.body;
  if (
    withPartner === null ||
    withPartner === undefined ||
    withPartner === "" ||
    !Chatter
  ) {
    throw new ApiError(500, "withPartner && Chatter is required");
  }
  const checking = await Conversation.findAll({
    where: {
      withPartner: {
        [Op.eq]: withPartner,
      },
      Chatter: {
        [Op.eq]: Chatter,
      },
    },
  });
  if (checking.length !== 0) {
    throw new ApiError(500, "This conversation is already existed !!!");
  }
  const data = await Conversation.create({ withPartner, Chatter });

  res.status(200).send(data);
});

exports.getAllConversation = catchAsync(async (req, res) => {
  const { option, page, limit } = req.query;
  let withPartner;
  if (option == 0) {
    withPartner = true;
  } else if (option == 1) {
    withPartner = false;
  } else {
    throw new ApiError(500, "wrong option format (0 or 1)");
  }
  const data = await baseController.Pagination(Conversation, page, limit, {
    where: {
      withPartner,
    },
    order: [["updatedAt", "DESC"]],
  });
  let newData = [];
  newData = await Promise.all(
    data.data.map(async (val) => {
      let user = {};
      const newestMessage = await Message.findOne({
        where: {
          ConversationId: val.id,
        },
        order: [["createdAt", "DESC"]],
      });
      if (val.withPartner) {
        user = await RegisterPartner.findByPk(val.Chatter);
      } else {
        user = await BookingUser.findByPk(val.Chatter);
      }
      return {
        ...val.dataValues,
        Chatter: user.dataValues,
        newestMessage,
      };
    })
  );

  res.status(200).json({
    ...data,
    data: newData,
  });
});

exports.createMessage = catchAsync(async (req, res) => {
  const { ConversationId, Content, Admin } = req.body;
  let PartnerId, CustomerId;
  const conversation = await Conversation.findByPk(ConversationId);
  if (!conversation) {
    throw new ApiError(500, "conversation does not exist");
  }
  if (Admin === "" || Admin === null || Admin === undefined) {
    throw new ApiError(500, "field admin is required");
  }
  if (Admin) {
    PartnerId = -1;
    CustomerId = -1;
  } else if (conversation.dataValues.withPartner) {
    PartnerId = conversation.dataValues.Chatter;
    CustomerId = -1;
  } else {
    CustomerId = conversation.dataValues.Chatter;
    PartnerId = -1;
  }
  const data = await Message.create({
    ConversationId,
    Content,
    PartnerId,
    CustomerId,
  });
  const messagesCount = await Message.count({
    where: {
      ConversationId,
    },
  });
  await Conversation.update(
    { NoOfMessage: messagesCount },
    {
      where: {
        id: ConversationId,
      },
    }
  );

  res.status(200).send(data);
});
exports.getMessageByConversationId = catchAsync(async (req, res) => {
  const { page, limit, ConversationId } = req.query;
  const messages = await baseController.Pagination(Message, page, limit, {
    order: [["id", "DESC"]],
    where: {
      ConversationId,
    },
  });
  const newData = {
    ...messages,
    data: await Promise.all(
      messages.data.map(async (val) => {
        let Chatting;
        if (val.dataValues.CustomerId !== -1) {
          const raw = await BookingUser.findByPk(val.dataValues.CustomerId);
          Chatting = {
            id: raw.dataValues.id,
            Username: raw.dataValues.Username,
            Image: raw.dataValues.Image,
            Email: raw.dataValues.Email,
            Fullname: raw.dataValues.Fullname,
            Phone: raw.dataValues.Phone,
          };
        } else if (val.dataValues.PartnerId !== -1) {
          const raw = await RegisterPartner.findByPk(val.dataValues.PartnerId);
          Chatting = {
            id: raw.dataValues.id,
            PartnerName: raw.dataValues.PartnerName,
            Phone: raw.dataValues.Phone,
            Email: raw.dataValues.Email,
          };
        } else {
          Chatting = "Admin";
        }
        return {
          id: val.dataValues.id,
          ConversationId: val.dataValues.ConversationId,
          createdAt: val.dataValues.createdAt,
          Content: val.dataValues.Content,
          Type: val.dataValues.Type,
          fileName: val.dataValues.fileName,
          Chatting,
        };
      })
    ),
  };

  res.status(200).json(newData);
});

exports.getConversationById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const data = await Conversation.findOne({
    where: {
      id,
    },
  });
  let user = {};
  const newestMessage = await Message.findOne({
    where: {
      ConversationId: data.dataValues.id,
    },
    order: [["id", "DESC"]],
  });
  if (data.dataValues.withPartner) {
    user = await RegisterPartner.findByPk(data.dataValues.Chatter);
  } else {
    user = await BookingUser.findByPk(data.dataValues.Chatter);
  }
  const newData = {
    ...data.dataValues,
    Chatter: user.dataValues,
    newestMessage: newestMessage.dataValues,
  };

  res.status(200).json({
    success: true,
    data: newData,
  });
});

exports.getConversationByParticipant = catchAsync(async (req, res) => {
  //************************************* */
  //partnerWithAdmin: Boolean
  //id: UserId or PartnerId
  //************************************* */

  const { id, partnerWithAdmin } = req.query;

  //******* Find the conversation *******
  const whereClause = Boolean(+partnerWithAdmin)
    ? {
        UserId: {
          [Op.eq]: null,
        },
        AdminId: {
          [Op.ne]: null,
        },
        PartnerId: +id,
      }
    : {
        UserId: +id,
        AdminId: {
          [Op.ne]: null,
        },
        PartnerId: {
          [Op.eq]: null,
        },
      };
  const data = await ConversationsUsers.findOne({
    where: whereClause,
  });

  //******* Get latest message *******
  let user = {};
  const newestMessage = await MessagesUser.findOne({
    where: {
      ConversationId: data.dataValues.id,
    },
    order: [["id", "DESC"]],
  });

  //******* Find the user who is chatting with Admin *******
  if (Boolean(+partnerWithAdmin)) {
    user = await RegisterPartner.findByPk(data.dataValues.PartnerId);
  } else {
    user = await BookingUser.findByPk(data.dataValues.UserId);
  }

  //******* Response data *******
  const newData = {
    ...data?.dataValues,
    Chatter: user?.dataValues,
    newestMessage: newestMessage?.dataValues,
  };

  res.status(200).json({
    success: true,
    data: newData,
  });
});

exports.updateReadMessAdmin = catchAsync(async (req, res) => {
  const { id } = req.body;
  await Message.update(
    { IsRead: true },
    {
      where: {
        id,
        IsRead: {
          [Op.not]: 1,
        },
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "The message has been read.",
  });
});

exports.getConversationByChatterId = catchAsync(async (req, res) => {
  const { withPartner, Chatter } = req.query;
  if (
    withPartner === null ||
    withPartner === undefined ||
    withPartner === "" ||
    !Chatter
  ) {
    throw new ApiError(500, "withPartner && Chatter is required");
  }
  const data = await Conversation.findAll({
    where: {
      withPartner: {
        [Op.eq]: withPartner,
      },
      Chatter: {
        [Op.eq]: Chatter,
      },
    },
  });
  const newestMessage = await Message.findOne({
    where: {
      ConversationId: data[0].dataValues.id,
    },
    order: [["id", "DESC"]],
  });
  let user = {};
  if (withPartner == 1) {
    user = await RegisterPartner.findByPk(data[0].dataValues.Chatter);
  } else {
    user = await BookingUser.findByPk(data[0].dataValues.Chatter);
  }
  const newData = {
    ...data[0].dataValues,
    newestMessage,
    Chatter: user.dataValues,
  };

  res.status(200).send(newData);
});
