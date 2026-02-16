import mongoose from "mongoose";

// Coin to Rupee Schema
const coinToRupeeSchema = new mongoose.Schema(
  {
    coins: {
      type: Number,
    },
    rupees: {
      type: Number,
    },
  },
  { timestamps: true }
);

const CoinToRupee = mongoose.model("CoinToRupee", coinToRupeeSchema);
export default CoinToRupee;
