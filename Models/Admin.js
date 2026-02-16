import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  wallet: {
    type: Number,
    default: 0
  },
  transactionHistory: [{
    type: {
      type: String,
      enum: ["credited", "debited"]
    },
    coins: {
      type: Number
    },
    amount: {
      type: Number
    },
    description: {
      type: String
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    callId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Calling'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
adminSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;