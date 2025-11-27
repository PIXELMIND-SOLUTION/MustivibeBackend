import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure that all directories exist before use
const makeDir = (dir) => fs.mkdirSync(dir, { recursive: true });

// 📁 Define all directories
const dirs = {
  userProfileImages: path.join(__dirname, '..', 'uploads', 'userProfileImages'), // Profile images directory
};

// 🔧 Create all directories if they do not exist
Object.values(dirs).forEach(makeDir);

// Generic filename generator (timestamp + original filename)
const getFilename = (file) => `${Date.now()}-${file.originalname}`;

// Multer configuration for handling user profile images
export const uploadUserProfileImages = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, dirs.userProfileImages), // Save to the correct directory
    filename: (req, file, cb) => cb(null, getFilename(file)), // Generate a unique filename
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).single('profileImage'); // Only a single profile image will be uploaded
