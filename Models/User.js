import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
    },
    profileImage: {
      type: String, // path to the uploaded profile image
    },
    nickname: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date, // Date of birth
      default: null, // Nullable field
    },
    referralCode: {
      type: String,
      default: null, // Nullable field
    },
    language: {
      type: String,
      default: 'English', // Default language is English
    },
    userType: {
      type: String,
      default: 'user', // Default userType is 'user'
    },
    wallet: {
      type: Number,
      default: 0, // Default wallet amount
    },
      // ✅ Moved location here (root level)
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0.0, 0.0],
    },
  },

  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
