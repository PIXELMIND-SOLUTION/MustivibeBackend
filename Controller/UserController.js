import User from "../Models/User.js"

// Temporary OTP storage (in-memory)
const otpStore = {}; // { "mobile": "1234" }

// SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile is required" });
    }

    const otp = "1234"; // fixed OTP
    otpStore[mobile] = otp;

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      mobile,
      otp, // you asked to return OTP
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ success: false, message: "Mobile & OTP are required" });
    }

    const storedOtp = otpStore[mobile];

    if (!storedOtp) {
      return res.status(400).json({ success: false, message: "OTP expired or not sent" });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP correct → create or find user
    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({ mobile });
    }

    delete otpStore[mobile]; // remove OTP after verification

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user,
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// RESEND OTP
export const resendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile is required" });
    }

    const otp = "1234"; // fixed OTP
    otpStore[mobile] = otp;

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      mobile,
      otp,
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};



export const uploadUserProfileImage = async (req, res) => {
  try {
    // Extract userId from route params
    const { userId } = req.params;

    // Get additional fields from the request body
    const {
      name,
      nickname,
      gender,
      dob,
      referralCode,
      language,
      userType
    } = req.body;

    // If no file uploaded, return an error
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No profile image uploaded',
      });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Construct file path for profile image
    const profileImagePath = `/uploads/userProfileImages/${req.file.filename}`;

    // Update the user document with the new data
    if (name) user.name = name;
    if (nickname) user.nickname = nickname;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (referralCode) user.referralCode = referralCode;
    if (language) user.language = language;
    if (userType) user.userType = userType;

    // Update the profile image
    user.profileImage = profileImagePath;

    // Save the updated user document
    await user.save();

    // Respond with the updated user data
    return res.status(200).json({
      success: true,
      message: 'Profile image and data uploaded successfully',
      user,
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while uploading profile image',
    });
  }
};



export const updateUserLocation = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    if (!userId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'userId, latitude, and longitude are required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        location: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'User location stored successfully',
      location: updatedUser.location,
    });
  } catch (error) {
    console.error('Error storing user location:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getUserLocation = async (req, res) => {
  try {
    const { userId } = req.params; // User ID comes from the route params

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Fetch user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If no location is stored
    if (!user.location || !user.location.coordinates || user.location.coordinates.length === 0) {
      return res.status(404).json({ message: 'User location not found' });
    }

    // Extract latitude and longitude from the location
    const [longitude, latitude] = user.location.coordinates;

    return res.status(200).json({
      message: 'User location fetched successfully',
      location: { latitude, longitude },
    });
  } catch (error) {
    console.error('Error retrieving user location:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
