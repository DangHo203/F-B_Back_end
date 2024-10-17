const express = require("express");
const router = express.Router();

const {
    loginController,
    requestOtpController,
    verifyOtpController,
    registerController,
} = require("./customerController");

router.post("/login", loginController);
router.post("/request-otp", requestOtpController);
router.post("/verify-otp", verifyOtpController);
router.post("/register", registerController);

export default router;
