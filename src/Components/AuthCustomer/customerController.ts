import { Request, Response } from "express";
const { login, sendOtp, verifyOtp, register } = require("./customer.service");
// Controller cho việc đăng nhập
const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.query;
    console.log(email, password);
    if (!email || !password) {
        return res
            .status(400)
            .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    try {
        const result = await login(email, password);
        return res.status(200).json(result);
    } catch (error: any) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

// Controller cho việc yêu cầu OTP
const requestOtpController = async (req: Request, res: Response) => {
    const { email } = req.query;

    if (!email) {
        return res
            .status(400)
            .json({ message: "Please provide an email address." });
    }

    try {
        const result = await sendOtp(email);
        if (result.success) {
            return res.status(200).json({ message: "OTP sent successfully!" });
        } else {
            return res.status(500).json({ message: "Failed to send OTP." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Đã xảy ra lỗi" });
    }
};

// Controller cho việc xác minh OTP
const verifyOtpController = (req: Request, res: Response) => {
    const { otp, email } = req.query;

    if (!otp || !email) {
        return res
            .status(400)
            .json({ message: "Please provide both OTP and email." });
    }

    const isValid = verifyOtp(otp);

    if (!isValid) {
        return res.status(400).json({
            status: 400,
            message: "Invalid OTP code. Please double-check and try again.",
        });
    }

    return res.status(200).json({ message: "OTP verified successfully!" });
};

// Controller cho việc đăng ký
const registerController = async (req: Request, res: Response) => {
    const { name, email, password } = req.query;

    if (!name || !email || !password) {
        return res
            .status(400)
            .json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    try {
        const result = await register(name, email, password);
        return res.status(200).json({
            message: "Đăng ký thành công",
            result
        });
    } catch (error: any) {
        if (error.status === 409) {
            return res.status(409).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
};

export = {
    loginController,
    requestOtpController,
    verifyOtpController,
    registerController,
};
