import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";

import connectDatabase from './db/connectDatabase.js';
import User from "./Models/User.js";     // <-- IMPORTANT
import userRoutes from "./Routes/UserRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// ----------------------
// SOCKET.IO SETUP
// ----------------------
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// REAL-TIME ONLINE/OFFLINE USERS
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // When user enters app → send userId from frontend
  socket.on("user-online", async (userId) => {
    if (!userId) return;

    await User.findByIdAndUpdate(userId, {
      isOnline: true,
      socketId: socket.id
    });

    console.log("ONLINE:", userId);
  });

  // When user closes app / internet off
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    const user = await User.findOne({ socketId: socket.id });

    if (user) {
      await User.findByIdAndUpdate(user._id, {
        isOnline: false,
        lastSeen: new Date(),
        socketId: null
      });

      console.log("OFFLINE:", user._id);
    }
  });
});

// ----------------------
// EXPRESS SETUP
// ----------------------
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

connectDatabase();

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Backend running..." });
});

const PORT = process.env.PORT || 6060;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
