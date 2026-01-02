import cloudinary from "../config/cloudinary.js";
import Message from "../Models/Message.js";
import ChatRoom from "../Models/ChatRoom.js";
import CommunicationRequest from "../Models/CommunicationRequest.js";
import fs from "fs";

/* ================================
   CREATE / GET CHAT ROOM
================================ */
export const createOrGetChatRoom = async (req, res) => {
  const { senderId, receiverId } = req.body;

  const permission = await CommunicationRequest.findOne({
    fromUser: senderId,
    toUser: receiverId,
    status: "approved",
    isBlocked: false
  });

  if (!permission) {
    return res.status(403).json({ success: false, message: "Chat not approved" });
  }

  let room = await ChatRoom.findOne({ users: { $all: [senderId, receiverId] } });
  if (!room) room = await ChatRoom.create({ users: [senderId, receiverId] });

  res.json({ success: true, chatRoomId: room._id });
};

/* ================================
   SEND MESSAGE (DB ONLY)
================================ */


export const sendMessage = async (req, res) => {
  try {
    const { chatRoomId, senderId, messageType, text } = req.body;

    if (!chatRoomId || !senderId || !messageType) {
      return res.status(400).json({
        success: false,
        message: "chatRoomId, senderId, messageType are required"
      });
    }

    let mediaUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {

        // ✅ ACCEPT BOTH media & mediaUrl
        if (file.fieldname !== "media" && file.fieldname !== "mediaUrl") {
          fs.unlinkSync(file.path);
          return res.status(400).json({
            success: false,
            message: `Invalid field '${file.fieldname}'. Use 'media' or 'mediaUrl'`
          });
        }

        // ✅ Allow only images & videos
        if (
          !file.mimetype.startsWith("image") &&
          !file.mimetype.startsWith("video")
        ) {
          fs.unlinkSync(file.path);
          return res.status(400).json({
            success: false,
            message: "Only images and videos are allowed"
          });
        }

        const upload = await cloudinary.uploader.upload(file.path, {
          resource_type: file.mimetype.startsWith("video") ? "video" : "image",
          folder: "chat-media"
        });

        mediaUrls.push(upload.secure_url);
        fs.unlinkSync(file.path);
      }
    }

    const message = await Message.create({
      chatRoomId,
      sender: senderId,
      messageType,
      text: text || null,
      mediaUrl: mediaUrls.length ? mediaUrls : null
    });

    await ChatRoom.findByIdAndUpdate(chatRoomId, {
      lastMessage: message._id
    });

    return res.status(201).json({
      success: true,
      message
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* ================================
   GET ALL MESSAGES
================================ */
export const getAllMessages = async (req, res) => {
  const { chatRoomId, userId } = req.params;

  const messages = await Message.find({
    chatRoomId,
    deletedFor: { $ne: userId }
  })
    .populate("sender", "name profileImage")
    .sort({ createdAt: 1 });

  res.json({ success: true, messages });
};

/* ================================
   EDIT MESSAGE
================================ */
export const editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { userId, newText } = req.body;

  const message = await Message.findById(messageId);
  if (!message) return res.status(404).json({ success: false, message: "Not found" });

  if (message.sender.toString() !== userId)
    return res.status(403).json({ success: false, message: "Not allowed" });

  message.text = newText;
  message.isEdited = true;
  message.editedAt = new Date();
  await message.save();

  res.json({ success: true, updatedMessage: message });
};

/* ================================
   DELETE MESSAGE
================================ */
export const deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const { userId, deleteFor } = req.body;

  const message = await Message.findById(messageId);
  if (!message) return res.status(404).json({ success: false, message: "Not found" });

  if (deleteFor === "me") {
    message.deletedFor.push(userId);
    await message.save();
    return res.json({ success: true, message: "Deleted for me" });
  }

  if (deleteFor === "both") {
    await Message.findByIdAndDelete(messageId);
    return res.json({ success: true, message: "Deleted for both" });
  }
};

/* ================================
   GET MY CHATS
================================ */
export const getMyChats = async (req, res) => {
  const { userId } = req.params;

  const chats = await ChatRoom.find({ users: userId })
    .populate("users", "name profileImage isOnline lastSeen")
    .populate("lastMessage");

  res.json({ success: true, chats });
};
