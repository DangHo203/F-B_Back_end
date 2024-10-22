import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { totp } from "otplib";
import db from "../../config/database.config";

import {
    LoginResponse,
    OtpResponse,
    RegisterResponse,
    User,
} from "./customer.interface";

const secret_key = "secret_key"; // JWT secret key
const otpSecretKey = "ahihi"; // OTP secret key
const otpExpireSeconds = 300; // OTP expiration time

totp.options = { digits: 6, step: otpExpireSeconds };

// Define types for user and responses

// Service cho việc xác thực người dùng
export const login = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const sql = "SELECT * FROM Users WHERE email = ?";
    return new Promise((resolve, reject) => {
        db.query(sql, [email], async (err, result) => {
            if (err) return reject({ status: 500, message: "Đã xảy ra lỗi" });

            const userResult = result as User[];
            if (userResult.length === 0)
                return reject({ status: 410, message: "Email không tồn tại" });

            const user: User = (result as User[])[0];
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );

            if (!isPasswordValid)
                return reject({ status: 411, message: "Mật khẩu không đúng" });

            const token = jwt.sign(
                { id: user.user_id, email: user.email },
                secret_key,
                { expiresIn: "1h" }
            );

            resolve({
                message: "Đăng nhập thành công",
                token,
                user: {
                    id: user.user_id,
                    email: user.email,
                    fullName: user.fullName,
                    image: user.image,
                },
            });
        });
    });
};

// Service cho việc gửi OTP
export const sendOtp = async (email: string): Promise<OtpResponse> => {
    const otp = totp.generate(otpSecretKey);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "duonglatoi111@gmail.com",
            pass: "fqab gidq ebji illn",
        },
        secure: false,
    });

    const mailOptions = {
        from: "duonglatoi111@gmail.com",
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in ${otpExpireSeconds} seconds.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, otp };
    } catch (error) {
        return { success: false, error };
    }
};

const checkEmailExist = async (email: string): Promise<boolean> => {
    const sql = "SELECT * FROM Users WHERE email = ?";
    return new Promise((resolve, reject) => {
        db.query(sql, [email], (err, result) => {
            if (err) return reject(err);
            resolve((result as User[]).length > 0);
        });
    });
};

// Service cho việc đăng ký người dùng
export const register = async (
    name: string,
    email: string,
    password: string,
): Promise<RegisterResponse> => {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const emailExists = await checkEmailExist(email);
    if (emailExists) {
        return Promise.reject({ status: 409, message: "Email đã tồn tại" });
    }
    console.log(hashPassword);
    const sql =
        "INSERT INTO Users (username,fullName, email, password, status, create_at) VALUES (?,?, ?, ?, ?,NOW())";
    return new Promise((resolve, reject) => {
        db.query(sql, ["customer",name, email, hashPassword,"active"], (err, result) => {
            console.log(err?.message);
            if (err) return reject({ status: 500, message: "Đã xảy ra lỗi" });
            resolve({ message: "Đăng ký thành công", result });
        });
    });
};

// Service cho việc xác minh OTP
export const verifyOtp = (otp: string): boolean => {
    const isValid = totp.check(otp, otpSecretKey);
    return isValid;
};
