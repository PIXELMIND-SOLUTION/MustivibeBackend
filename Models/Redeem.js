import mongoose from "mongoose";

const redeemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    coins: {
      type: Number,
    },

    amount: {
      type: Number,
    },

    upiId: {
      type: String,
    },

    status: {
      type: String,
      enum: ["process", "completed", "rejected"],
      default: "process"
    }
  },
  { timestamps: true }
);

const Redeem = mongoose.model("Redeem", redeemSchema);
export default Redeem;
