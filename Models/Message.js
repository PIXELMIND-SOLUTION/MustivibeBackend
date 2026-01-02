import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chatRoomId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatRoom", required: true },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

        messageType: {
            type: String,
            enum: ["text", "image", "video", "sticker"],
            default: "text"
        },

        text: String,
        mediaUrl: {
            type: [String],
            default: null
        },

        deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        isEdited: { type: Boolean, default: false },
        editedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
