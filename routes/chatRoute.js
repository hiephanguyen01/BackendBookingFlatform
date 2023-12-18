const express = require("express");
const {
  createConversation,
  createMessage,
  getAllConversation,
  getMessageByConversationId,
  getConversationById,
  getConversationByParticipant,
  updateReadMessAdmin,
  getConversationByChatterId,
} = require("../controllers/conversation");
const {
  createConversationUser,
  getAllConversationUser,
  getConversationUsersById,
  getMessageUserByConversationId,
  createMessageUser,
  updateReadMessUserByIdUA,
  getAllConversationUserNolimit,
  getCountNumberOfConversationHasNewMessageById,
  getAllConversationID,
  deleteMessage,
} = require("../controllers/conversationUser");
const router = express.Router();

router.post("/conversation-user", createConversationUser);
router.post("/conversation", createConversation);

router.get("/conversation-user", getAllConversationUser);
router.get(
  "/conversation-user/count-conversation-has-new-mess",
  getCountNumberOfConversationHasNewMessageById
);
router.get("/conversation-user-all", getAllConversationUserNolimit);
router.get("/conversation", getAllConversation);

router.get("/conversation-user/all-ids", getAllConversationID);
router.get("/conversation-user/:id", getConversationUsersById);
router.get("/conversation/:id", getConversationById);
router.get("/conversation-chatter", getConversationByChatterId);

router.post("/message-user", createMessageUser);
router.post("/message", createMessage);

router.get("/message-user", getMessageUserByConversationId);
router.get("/message", getMessageByConversationId);

router.get("/conversation-with-admin", getConversationByParticipant);

router.patch("/message-user", updateReadMessUserByIdUA);
router.patch("/message", updateReadMessAdmin);
// router.patch("/message-user/soft-delete", softDeleteMessage)

router.delete("/message-user/:messageId", deleteMessage);
module.exports = { router };
