import multer from "multer";
import path from "path";
import fs from "fs";

// TEMP upload folder
const tempDir = "uploads/";

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

export const uploadUserProfileImages = multer({ storage }).single("profileImage");
