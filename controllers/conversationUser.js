const {
  ConversationsUsers,
  AdminAccount,
  MessagesUser,
  BookingUser,
  RegisterPartner,
  AppBinaryObject,
} = require("../models");
const { Op } = require("sequelize");
const ApiError = require("../utils/ApiError");
const { createWebHook } = require("../utils/WebHook");
const catchAsync = require("../middlewares/async");
const moment = require("moment");
const baseController = require("../utils/BaseController");

// Utilities use in this controller
const adminListing = async () => {
  const admins = await AdminAccount.findAll({
    attributes: ["id"],
  });
  return admins.map((item) => item.dataValues.id);
};

const orchestrateChatRoomForAdmin = async () => {
  const list_admin = await adminListing();

  let list_number_of_joined_conversation = await Promise.all(
    list_admin.map(async (el) => {
      return await ConversationsUsers.count({
        where: {
          AdminId: el,
        },
      });
    })
  );

  let index_of_min_value_in_list_number_of_joined_conversation =
    list_number_of_joined_conversation.indexOf(
      Math.min(...list_number_of_joined_conversation)
    );
  let adminId_has_least_joined_conversation =
    list_admin[index_of_min_value_in_list_number_of_joined_conversation];
  return adminId_has_least_joined_conversation;
};

const checkForExistingConversation = async (PartnerId, UserId, AdminId) => {
  let condition_clause = null;
  if (AdminId && UserId && UserId !== "null") {
    condition_clause = {
      [Op.and]: {
        AdminId: {
          [Op.ne]: null,
        },
        UserId,
        PartnerId: null,
      },
    };
  } else if (UserId && PartnerId && PartnerId !== "null" && UserId !== "null") {
    condition_clause = {
      [Op.and]: {
        PartnerId,
        UserId,
      },
    };
  } else {
    condition_clause = {
      [Op.and]: {
        AdminId: {
          [Op.ne]: null,
        },
        UserId: null,
        PartnerId,
      },
    };
  }
  let checking = await ConversationsUsers.findAll({ where: condition_clause }); //list of dataValues
  checking = checking.map((item) => item.dataValues); //filter the dataValues layer
  return checking;
};

/** Get all conversation of either User, Partner or Admin */
exports.getAllConversationUser = catchAsync(async (req, res) => {
  const { isUser, isPartner, id, page, limit } = req.query;
  // ******* Get all conversation of Partner *******
  if (isUser == 0 && isPartner == 1) {
    const data = await ConversationsUsers.findAll({
      where: {
        PartnerId: id,
      },
      order: [["updatedAt", "DESC"]],
    });
    let newData = [];
    newData = await Promise.all(
      data.data.map(async (val) => {
        let user = {};
        let partner = {};
        const newestMessage = await MessagesUser.findOne({
          where: {
            ConversationId: val.id,
          },
          order: [["createdAt", "DESC"]],
        });
        partner = await RegisterPartner.findByPk(val.PartnerId);
        user = await BookingUser.findByPk(val.UserId);
        return {
          ...val.dataValues,
          PartnerId: partner.dataValues,
          UserId: user.dataValues,
          newestMessage,
        };
      })
    );

    res.status(200).json({
      ...data,
      data: newData,
    });
    // ******* Get all conversation of User *******
  } else if (isUser == 1 && isPartner == 0) {
    const data = await baseController.Pagination(
      ConversationsUsers,
      page,
      limit,
      {
        where: {
          UserId: id,
        },
        order: [["updatedAt", "DESC"]],
      }
    );
    let newData = [];
    newData = await Promise.all(
      data.data.map(async (val) => {
        let user = {};
        let partner = {};
        let admin = {};
        const newestMessage = await MessagesUser.findOne({
          where: {
            ConversationId: val.id,
          },
          order: [["createdAt", "DESC"]],
        });
        user = await BookingUser.findByPk(val.UserId);
        if (val.PartnerId !== null) {
          partner = await RegisterPartner.findByPk(val.PartnerId);
          if (partner) {
            const clone = Object.assign({}, val.dataValues);
            delete clone.AdminId;
            return {
              ...clone,
              PartnerId: partner.dataValues,
              UserId: user.dataValues,
              newestMessage,
            };
          }
        } else {
          admin = await AdminAccount.findByPk(val.AdminId);
          if (admin) {
            const clone = Object.assign({}, val.dataValues);
            delete clone.PartnerId;
            return {
              ...clone,
              AdminId: { ...admin.dataValues },
              UserId: user.dataValues,
              newestMessage,
            };
          }
        }
      })
    );

    res.status(200).json({
      ...data,
      data: newData,
    });
    // ******* Get all conversation of Admin *******
  } else if (isUser == 0 && isPartner == 0) {
    // không phải user và không phải partner thì là admin thôi
    const data = await baseController.Pagination(
      ConversationsUsers,
      page,
      limit,
      {
        where: {
          AdminId: id,
        },
        order: [["updatedAt", "DESC"]],
      }
    );
    let newData = [];
    newData = await Promise.all(
      data.data.map(async (val) => {
        let user = {};
        let admin = {};
        const newestMessage = await MessagesUser.findOne({
          where: {
            ConversationId: val.id,
          },
          order: [["createdAt", "DESC"]],
        });
        admin = await AdminAccount.findByPk(val.AdminId);
        user = await BookingUser.findByPk(val.UserId);
        return {
          ...val.dataValues,
          AdminId: admin.dataValues,
          UserId: user.dataValues,
          newestMessage,
        };
      })
    );

    res.status(200).json({
      ...data,
      data: newData,
    });
  } else {
    throw new ApiError(500, "Wrong option format (0 or 1)");
  }
});

exports.getConversationUsersById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = await ConversationsUsers.findOne({
    where: {
      id,
    },
  });
  let user = {};
  let partner = {};
  const newestMessage = await MessagesUser.findOne({
    where: {
      ConversationId: data.dataValues.id,
    },
    order: [["createdAt", "DESC"]],
  });
  partner = await RegisterPartner.findByPk(data.dataValues.PartnerId);
  user = await BookingUser.findByPk(data.dataValues.UserId);
  const newData = {
    ...data.dataValues,
    PartnerId: partner.dataValues,
    UserId: user.dataValues,
    newestMessage: newestMessage ? newestMessage.dataValues : null,
  };
  res.status(200).json({
    success: true,
    data: newData,
  });
});

exports.getMessageUserByConversationId = catchAsync(async (req, res) => {
  const { page, limit, ConversationId } = req.query;
  const messages = await baseController.Pagination(MessagesUser, page, limit, {
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
        if (val.dataValues.UserId !== -1 && val.dataValues.UserId !== null) {
          const raw = await BookingUser.findByPk(val.dataValues.UserId);
          Chatting = {
            id: raw.dataValues.id,
            Username: raw.dataValues.Username,
            Image: raw.dataValues.Image,
            Email: raw.dataValues.Email,
            Fullname: raw.dataValues.Fullname,
            Phone: raw.dataValues.Phone,
          };
        } else if (
          val.dataValues.PartnerId !== -1 &&
          val.dataValues.PartnerId !== null
        ) {
          const raw = await RegisterPartner.findByPk(val.dataValues.PartnerId);
          Chatting = {
            id: raw.dataValues.id,
            PartnerName: raw.dataValues?.PartnerName,
            Phone: raw.dataValues?.Phone,
            Email: raw.dataValues?.Email,
          };
        } else if (
          val.dataValues.AdminId !== -1 &&
          val.dataValues.AdminId !== null
        ) {
          const raw = await AdminAccount.findByPk(val.dataValues.AdminId);
          Chatting = {
            id: raw.dataValues.id,
            AdminName: raw.dataValues?.name,
            Phone: raw.dataValues?.phone,
          };
        } else {
          Chatting = "";
        }
        return {
          id: val.dataValues.id,
          ConversationId: val.dataValues.ConversationId,
          createdAt: val.dataValues.createdAt,
          Content: val.dataValues.Content,
          Type: val.dataValues.Type,
          fileName: val.dataValues.fileName,
          sender: Chatting?.AdminName ? "admin" : "other", // other mean User or Partner
          Chatting,
        };
      })
    ),
  };

  res.status(200).json(newData);
});

exports.getAllConversationUserNolimit = catchAsync(async (req, res) => {
  const { partner, id } = req.query;
  if (partner == 0) {
    const data = await ConversationsUsers.findAll({
      where: {
        PartnerId: id,
      },
      order: [["updatedAt", "DESC"]],
    });
    let newData = [];
    newData = await Promise.all(
      data.map(async (val) => {
        let user = {};
        let partner = {};
        const newestMessage = await MessagesUser.findOne({
          where: {
            ConversationId: val.id,
          },
          order: [["createdAt", "DESC"]],
        });
        partner = await RegisterPartner.findByPk(val.PartnerId);
        user = await BookingUser.findByPk(val.UserId);
        return {
          ...val.dataValues,
          PartnerId: partner.dataValues,
          UserId: user.dataValues,
          newestMessage,
        };
      })
    );

    res.status(200).json({
      ...data,
      data: newData,
    });
  } else if (partner == 1) {
    const data = await ConversationsUsers.findAll({
      where: {
        UserId: id,
      },
      order: [["updatedAt", "DESC"]],
    });
    let newData = [];
    newData = await Promise.all(
      data.map(async (val) => {
        let user = {};
        let partner = {};
        const newestMessage = await MessagesUser.findOne({
          where: {
            ConversationId: val.id,
          },
          order: [["createdAt", "DESC"]],
        });
        partner = await RegisterPartner.findByPk(val.PartnerId);
        user = await BookingUser.findByPk(val.UserId);
        return {
          ...val.dataValues,
          PartnerId: partner.dataValues,
          UserId: user.dataValues,
          newestMessage,
        };
      })
    );

    res.status(200).json({
      ...data,
      data: newData,
    });
  } else {
    throw new ApiError(500, "wrong option format (0 or 1)");
  }
});

exports.getAllConversationID = catchAsync(async (req, res) => {
  /**
   * Get all conversation id where room member is attended
   *
   * Input: memberId <int>, role <string>
   *
   * Output: Array of id <array <object> >
   */
  const { memberId, role } = req.query;
  let whereClause = null;
  switch (role) {
    case "user":
      whereClause = {
        UserId: memberId,
      };
      break;
    case "admin":
      whereClause = {
        AdminId: memberId,
      };
      break;

    case "partner":
      whereClause = {
        PartnerId: memberId,
      };
      break;
  }
  const conversation = await ConversationsUsers.findAll({
    where: { ...whereClause },
    attributes: ["id"],
  });

  res.json({
    success: true,
    message: `Successfully retrieve all conversation id of user ${memberId}`,
    payload: conversation.map((el) => el.dataValues.id),
  });
});

exports.getCountNumberOfConversationHasNewMessageById = catchAsync(
  async (req, res) => {
    //id could be AdminId || PartnerId || UserId
    //role could be "Admin" || "Partner" || "User"
    const { id, role } = req.query;

    const applyCondition =
      role === "Admin"
        ? { where: { AdminId: id } }
        : role === "Partner"
        ? { where: { PartnerId: id } }
        : { where: { UserId: id } };

    let conversations = await ConversationsUsers.findAll({ ...applyCondition });
    conversations = conversations.map((val) => val.dataValues.id); // Array contain conversation id only

    let count = [];
    await Promise.all(
      conversations.map(async (val) => {
        //Only take message which is not from this user "id"
        const applyConditionMessageUser =
          role === "Admin"
            ? {
                ConversationId: val,
                AdminId: -1,
              }
            : role === "Partner"
            ? { ConversationId: val, PartnerId: -1 }
            : { ConversationId: val, UserId: -1 };
        const newestMess = await MessagesUser.findOne({
          where: { ...applyConditionMessageUser },
          order: [["createdAt", "DESC"]],
        });
        if (newestMess && !newestMess.dataValues.IsRead) count.push(val);
      })
    );

    res.json({
      success: true,
      message: "Successfully retrieve information",
      payload: count,
    });
  }
);

exports.createConversationUser = catchAsync(async (req, res) => {
  /**
   * Check if Conversation between them is existed or not first
   * Then will decide to create or retrieve the data later
   */
  //AdminId type is Boolean
  const { PartnerId, UserId, AdminId } = req.body;
  const newData = await createConversationUserRawFunction(
    PartnerId,
    UserId,
    AdminId
  );
  res.status(200).json({
    success: true,
    messages: "Retrieve data success!!",
    payload: newData,
  });
});

exports.createMessageUser = catchAsync(async (req, res) => {
  const { ConversationId, Content, Partner } = req.body;
  const data = await createMessageUserRawFunction(
    ConversationId,
    Content,
    Partner
  );
  res.status(200).send(data);
});

exports.updateReadMessUserByIdUA = catchAsync(async (req, res) => {
  const { ConversationId } = req.body;
  await MessagesUser.update(
    { IsRead: true },
    {
      where: {
        ConversationId,
        IsRead: {
          [Op.not]: 1,
        },
      },
    }
  );

  res.status(200).send("thanh cong");
});

exports.deleteMessage = catchAsync(async (req, res) => {
  const { messageId } = req.params;

  const conversationNumberOfMessages = await MessagesUser.findAll({
    where: {
      id: messageId,
    },
    include: [
      {
        model: ConversationsUsers,
        attributes: ["id", "NoOfMessage"],
      },
    ],
    attributes: ["id", "Type", "Content"],
  });

  let numberOfMessagesConversationUser =
    conversationNumberOfMessages[0].dataValues.ConversationsUser.dataValues
      .NoOfMessage;
  let conversationIdConversationUser =
    conversationNumberOfMessages[0].dataValues.ConversationsUser.dataValues.id;

  await MessagesUser.destroy({
    where: {
      id: messageId,
    },
  });

  await ConversationsUsers.update(
    { NoOfMessage: numberOfMessagesConversationUser - 1 },
    {
      where: {
        id: conversationIdConversationUser,
      },
    }
  );

  if (conversationNumberOfMessages[0].dataValues.Type.includes("file")) {
    await AppBinaryObject.destroy({
      where: {
        Id: conversationNumberOfMessages[0].dataValues.Content,
      },
    });
  }

  res.json({
    success: true,
    message: "Successfully delete message",
  });
});

/**
 * Breakdown functions
 */

exports.findConversationHasPartnerIdAndUserId = async (PartnerId, UserId) => {
  /**
   * Description: find conversation which contain both provided Partner and User
   *
   * Input: PartnerId <int>, UserId <int>
   *
   * Output: id <int> || null
   */
  const existConversationWithThisPartnerAndUser =
    await ConversationsUsers.findAll({
      where: {
        PartnerId,
        UserId,
      },
      attributes: ["id"],
    });

  if (existConversationWithThisPartnerAndUser.length > 0) {
    return existConversationWithThisPartnerAndUser[0].dataValues["id"];
  } else {
    return null;
  }
};

exports.createConversationUserRawFunction = async (
  PartnerId,
  UserId,
  AdminId
) => {
  /**
   * Description: create conversation with provided params in ConversationUsers model
   *
   * Input: PartnerId <int>, UserId <int>, AdminId <Boolean>
   *
   * Output: newData <object>
   */
  if ((!PartnerId && !UserId) || (!AdminId && !UserId)) {
    throw new ApiError(500, "Missing ID!");
  }

  const checking = await checkForExistingConversation(
    PartnerId,
    UserId,
    AdminId
  );

  let user = {};
  let partner = {};

  let data = null;
  user = await BookingUser.findByPk(UserId);
  let newData = {};
  if (AdminId) {
    /**
     * Get admin id, 1 user/partner can only chat to 1 admin.
     * So finding out the user/partner, will result in adminId founded
     */
    let admin = null;

    checking.length > 0 &&
      checking.every((el) => {
        if (UserId !== null) {
          if (el.UserId === UserId) {
            admin = el;
            return false;
          }
        } else if (PartnerId !== null) {
          if (el.PartnerId === PartnerId) {
            admin = el;
            return false;
          }
        }
        return true;
      });

    /**
     * If the conversation is existed then response the payload contain the existed conversation
     */
    if (checking.length > 0) {
      newData = {
        ...checking[0],
        Admin: admin,
        User: user.dataValues,
      };
      newData["appropriateResponseType"] = "get";
    } else {
      /**
       * Create new conversation because there were none conversation before
       */
      const chosen_admin_id = await orchestrateChatRoomForAdmin();
      data = await ConversationsUsers.create({
        UserId,
        AdminId: chosen_admin_id,
      });
      newData = {
        ...data.dataValues,
        Admin: admin,
        User: user.dataValues,
      };
      newData["appropriateResponseType"] = "create";
    }
  } else {
    partner = await RegisterPartner.findByPk(PartnerId);
    /**
     * If the conversation is existed then response the payload contain the existed conversation
     */
    if (checking.length > 0) {
      newData = {
        ...checking[0].dataValues,
        Partner: partner.dataValues,
        User: user.dataValues,
      };
      newData["appropriateResponseType"] = "get";
    } else {
      // *******
      // Create new conversation because there were none conversation before
      // *******
      data = await ConversationsUsers.create({ PartnerId, UserId });
      newData = {
        ...data.dataValues,
        Partner: partner.dataValues,
        User: user.dataValues,
      };
      newData["appropriateResponseType"] = "create";
    }
  }
  return newData;
};

exports.createMessageUserRawFunction = async (
  ConversationId,
  Content,
  Partner
) => {
  /**
   * Description: create message in MessagesUser model
   *
   * Input: ConversationId <int>, Partner <>, Content <string>
   *
   * Output: data <object>
   */
  let PartnerId, UserId;
  const conversation = await ConversationsUsers.findByPk(ConversationId);
  if (!conversation) {
    throw new ApiError(500, "conversation does not exist");
  }
  if (Partner === "" || Partner === null || Partner === undefined) {
    throw new ApiError(500, "field Partner is required");
  }
  if (Partner) {
    PartnerId = conversation.dataValues.PartnerId;
    UserId = -1;
  } else {
    PartnerId = -1;
    UserId = conversation.dataValues.UserId;
  }
  const data = await MessagesUser.create({
    ConversationId,
    Content,
    PartnerId,
    UserId,
  });
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

  return data;
};
