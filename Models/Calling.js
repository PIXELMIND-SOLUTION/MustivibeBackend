import mongoose from "mongoose";

const callingSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    callerId: {
      type: String,
    },
    callType: {
      type: String,
      enum: ["audio", "video"],
    },
    callerName: {
      type: String,
      default: "",
    },
    
    // 🔥 CRITICAL ZEGO FIELDS
    zegoRoomId: {
      type: String,
      unique: true,
      index: true,
    },
    senderZegoId: {
      type: String,
      default: "",
    },
    receiverZegoId: {
      type: String,
      default: "",
    },
    roomCreatedAt: {
      type: Date,
      default: null,
    },
    
    fcmToken: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["RINGING", "ACTIVE", "ENDED", "REJECTED", "MISSED", "FAILED"],
      default: "RINGING",
    },
    type: {
      type: String,
      enum: [
        "incoming_call", 
        "call_accepted", 
        "call_rejected", 
        "call_rejected_timeout", 
        "call_ended_by_sender", 
        "call_ended_by_receiver", 
        "call_ended_room_closed",
        "call_ended",
        "call_missed",
        "call_failed"
      ],
      default: "incoming_call",
    },
      femaleCredited: {
    type: Number,
    default: 0
  },
  adminCredited: {
    type: Number,
    default: 0
  },
  isReceiverFemale: {
    type: Boolean,
    default: false
  },
  senderGender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  receiverGender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
    startedAt: {
      type: Date,
      default: null,
    },
    endedAt: {
      type: Date,
      default: null,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    coinsDeducted: {
      type: Number,
      default: 0,
    },
    
    // Optional: Additional tracking
    isVideoCall: {
      type: Boolean,
      default: false,
    },
    serverRegion: {
      type: String,
      default: "",
    },
    zegoAppId: {
      type: String,
      default: "",
    },
  },
  { 
    timestamps: true,
    indexes: [
      { zegoRoomId: 1 },
      { senderId: 1, createdAt: -1 },
      { receiverId: 1, createdAt: -1 },
      { status: 1 }
    ]
  }
);

const Calling = mongoose.model("Calling", callingSchema);

export default Calling;