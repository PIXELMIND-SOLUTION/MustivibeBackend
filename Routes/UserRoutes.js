import express from "express";
import multer from "multer";
import * as UserController from "../Controller/UserController.js";import { uploadUserProfileImages } from "../config/multerConfig.js";

const router = express.Router();
const upload = multer({ dest: "tmp/" }); 


router.post("/send-otp", UserController.sendOtp);
router.post("/verify-otp", UserController.verifyOtp);
router.post("/resend-otp", UserController.resendOtp);
router.put('/createprofile/:userId', upload.single("profileImage"), UserController.uploadUserProfileImage);
router.put("/update-location", UserController.updateUserLocation);
router.get('/getlocation/:userId', UserController.getUserLocation);


router.get("/users/all", UserController.getAllUsers);
router.get("/users/:userId", UserController.getUserById);
router.delete("/users/delete/:userId", UserController.deleteUser);

export default router;
