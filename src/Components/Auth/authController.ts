import db from "../../config/database.config";
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");

//services
import {
    loginUser,
    registerUser,
    changePasswordService,
} from "./auth.service";

const Login = async (req: Request, res: Response) => {
    let { email, password } = req.query;
    if (!email || !password) {
        return res
            .status(400)
            .json({ status: 400, message: "Missing required fields" });
    }

    try {
        const { user, token, refreshToken } = await loginUser(
            email as string,
            password as string
        );
        return res.status(200).json({
            status: 200,
            message: "Login successfully",
            data: {
                user,
                token,
                refreshToken,
            },
        });
    } catch (err: any) {
        res.status(err.status || 500).json({
            status: err.status || 500,
            message: err.message || "Server error",
        });
    }
};

const Register = async (req: Request, res: Response) => {
    let { email, password, name, phone, username, role } = req.query;

    if (!email || !password || !name || !phone || !username || !role) {
        return res.status(403).json({ message: "Missing required fields" });
    }

    try {
        const data = await registerUser({
            name: name as string,
            email: email as string,
            password: password as string,
            phone: phone as string,
            username: username as string,
            role: role as string,
        });
        return res.status(200).json({
            data: data,
        });
    } catch (err: any) {
        res.status(err.status || 500).json({
            status: err.status || 500,
            message: err.message || "Server error",
        });
    }
};

const changePassword = async (req: Request, res: Response) => {
    const { email, oldPassword, newPassword } = req.query;
    if (!email || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const data = await changePasswordService({
            email: email as string,
            oldPassword: oldPassword as string,
            newPassword: newPassword as string,
        });
        return res.status(200).json({
            status: 200,
            data: data,
            message: "Change password successfully",
        });
    } catch (err: any) {
        res.status(err.status || 500).json({
            status: err.status || 500,
            message: err.message || "Server error",
        });
    }
};

const createNewAccessToken = async (req: Request, res: Response) => {
    const { _id } = req.query;
    if (!_id) {
        return res.status(400).json({ message: "ID is require!" });
    }
    let sql = `SELECT refreshToken FROM User WHERE _id = ${_id}`;
    db.query(sql, function (err: any, data: any) {
        if (err) throw err;
        const refreshToken = data[0].refreshToken;
        if (!refreshToken) {
            return res
                .status(400)
                .json({ message: "Refresh token is require!" });
        }
        jwt.verify(
            refreshToken,
            process.env.JWT_SECRET,
            (err: any, user: any) => {
                if (err) {
                    return res.status(403).json({
                        status: 403,
                        message: "RefreshToken has expired",
                    });
                }
                const accessToken = jwt.sign(
                    { email: user.email, _id: user._id },
                    process.env.JWT_SECRET,
                    { expiresIn: "1h" }
                );
                return res.status(200).json({ accessToken });
            }
        );
    });
};

export { Login, Register, createNewAccessToken, changePassword };
