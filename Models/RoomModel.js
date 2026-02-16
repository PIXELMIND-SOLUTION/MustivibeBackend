import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    // Room creator (normal user)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Room admin (Admin collection se)
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminSettings",
    },

    type: {
      type: String,
      trim: true,
    },

    tag: {
      type: String,
      trim: true,
    },

    // Start time (string as per your design)
    startDateTime: {
      type: String,
    },

    // Duration in minutes
    duration: {
      type: Number,
    },

       joinedUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        nickname: { type: String },
        gender: { type: String },
        mobile: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;
