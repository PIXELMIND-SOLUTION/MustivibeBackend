import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    mobile: { type: String },
    profileImage: { type: String },
    nickname: { type: String },
    gender: { type: String },

    dob: {
      type: Date,
      default: null,
    },

    referralCode: {
      type: String,
      default: null,
    },

    language: {
      type: String,
      default: 'English',
    },

    userType: {
      type: String,
      default: 'user',
    },

    wallet: {
      type: Number,
      default: 0,
    },

    // Location schema
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0.0, 0.0],
      }
    },

    hasCompletedProfile: { type: Boolean, default: false },
    hasLoggedIn: { type: Boolean, default: false },

    otp: { type: String },
    token: { type: String },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

// ⭐ ADD THIS IMPORTANT LINE
userSchema.index({ location: "2dsphere" });

const User = mongoose.model('User', userSchema);
export default User;
