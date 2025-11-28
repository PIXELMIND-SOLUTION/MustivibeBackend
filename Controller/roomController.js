import Room from "../Models/RoomModel.js";
import User from "../Models/User.js";

// ----------------------------------------------------
// CREATE ROOM
// ----------------------------------------------------
export const createRoom = async (req, res) => {
  try {
    const { userId, type, tag } = req.body;

    if (!userId || !type || !tag) {
      return res.status(400).json({
        success: false,
        message: "userId, type & tag required",
      });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const room = await Room.create({ userId, type, tag });

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
// GET ALL ROOMS
// ----------------------------------------------------
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("userId");

    return res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
// GET ROOM BY ID
// ----------------------------------------------------
export const getRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId).populate("userId");

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      room,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
// UPDATE ROOM
// ----------------------------------------------------
export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { type, tag } = req.body;

    const room = await Room.findByIdAndUpdate(
      roomId,
      { type, tag },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ----------------------------------------------------
// DELETE ROOM
// ----------------------------------------------------
export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findByIdAndDelete(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ----------------------------------------------------
// GET NEARBY USERS
// ----------------------------------------------------
export const getNearbyUsers = async (req, res) => {
  try {
    const { latitude, longitude, distance } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "latitude & longitude required"
      });
    }

    const maxDistance = distance ? parseInt(distance) : 5000; // 5 km default

    const users = await User.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: maxDistance
        }
      }
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};