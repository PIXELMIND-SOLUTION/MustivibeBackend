import express from "express";
import * as ChatController from "../Controller/chatController.js";
import { uploadChatMedia } from "../config/multer.js";

const router = express.Router();

/* ================================
   CREATE / GET CHAT ROOM
================================ */
router.post(
  "/room",
  ChatController.createOrGetChatRoom
);

/* ================================
   SEND MESSAGE (TEXT / MEDIA)
   Supports:
   - text only
   - images
   - videos
   - mixed media
================================ */
router.post(
  "/send-message",
  uploadChatMedia,        // 🔥 MULTER MIDDLEWARE
  ChatController.sendMessage
);

/* ================================
   GET ALL MESSAGES
================================ */
router.get(
  "/messages/:chatRoomId/:userId",
  ChatController.getAllMessages
);

/* ================================
   EDIT MESSAGE
================================ */
router.put(
  "/message/edit/:messageId",
  ChatController.editMessage
);

/* ================================
   DELETE MESSAGE
   deleteFor = "me" | "both"
================================ */
router.delete(
  "/message/:messageId",
  ChatController.deleteMessage
);

/* ================================
   GET MY CHATS
================================ */
router.get(
  "/my-chats/:userId",
  ChatController.getMyChats
);

export default router;
