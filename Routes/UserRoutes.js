import express from "express";
import { sendOtp, verifyOtp, resendOtp, uploadUserProfileImage, updateUserLocation, getUserLocation } from "../Controller/UserController.js";
import { uploadUserProfileImages } from "../config/multerConfig.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.put('/createprofile/:userId', uploadUserProfileImages, uploadUserProfileImage);
router.put('/addorupdatelocation/:userId', updateUserLocation);
router.get('/getlocation/:userId', getUserLocation);


export default router;
