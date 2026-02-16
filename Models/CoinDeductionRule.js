import mongoose from 'mongoose';

// Coin Deduction Rule Schema
const coinDeductionRuleSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['audio', 'video'], // Room type (audio or video)
    },
    duration: {
      type: Number,
      enum: [30, 60], // Allowed durations (30 or 60 minutes)
    },
    coins: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Model
const CoinDeductionRule = mongoose.model('CoinDeductionRule', coinDeductionRuleSchema);
export default CoinDeductionRule;
