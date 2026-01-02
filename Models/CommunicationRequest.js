import mongoose from "mongoose";

const communicationRequestSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["chat", "call", "room"],
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    isBlocked: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "CommunicationRequest",
  communicationRequestSchema
);
