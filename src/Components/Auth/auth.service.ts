import db from "../../config/database.config";
import bcrypt from "bcrypt";

interface User {
    _id: number;
    email: string;
    password: string;
    role: string;
    refreshToken: string;
}

import { generateToken, generateRefreshToken } from "../../middlewares/jwt";
export const loginUser = async (
    email: string,
    password: string
): Promise<{ user: User; token: string; refreshToken: string, role:string }> => {
    const sql = `SELECT * FROM Users WHERE email = ?`;

    return new Promise((resolve, reject) => {
        db.query(sql, [email], async function (err: any, data: any) {
            if (err) return reject(err);
            if (data.length === 0) {
                return reject({ status: 400, message: "Email does not exist" });
            }

            const isMatch = await bcrypt.compare(
                password.toString(),
                data[0]?.password
            );
            if (!isMatch) {
                return reject({
                    status: 401,
                    message: "Password is incorrect",
                });
            }

            if (data[0].role === "user" || data[0].status !== "active") {
                return reject({
                    status: 402,
                    message: "You are not allowed to login",
                });
            }

            const token = generateToken(data[0]?._id, data[0]?.role, data[0]?.status);
            const refreshToken = generateRefreshToken(data[0]?._id);

            const updateRefreshTokenSql = `UPDATE Users SET refreshToken = ? WHERE _id = ?`;
            db.query(
                updateRefreshTokenSql,
                [refreshToken, data[0]._id],
                function (err: any) {
                    if (err) return reject(err);
                }
            );

            resolve({ user: data[0], token, refreshToken, role: data[0].role });
        });
    });
};

export const registerUser = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    username: string;
    role: string;
    permission: string;
}): Promise<{ message: string; data: any }> => {
    const { name, email, password, phone, role, username, permission } = data;
    //hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password.toString(), salt);
    
    return new Promise(async (resolve, reject) => {
        const emailQuery = "SELECT * FROM Users WHERE email = ?";
        const emailResult: [] = await new Promise((resolve, reject) => {
            db.query(emailQuery, [email], (err: any, data: any) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        if (emailResult.length > 0) {
            return reject({
                status: 400,
                message: "Email already exists",
            });
        }

        // Check if phone number exists
        const phoneQuery = "SELECT * FROM Users WHERE phone = ?";
        const phoneResult: [] = await new Promise((resolve, reject) => {
            db.query(phoneQuery, [phone], (err: any, data: any) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        if (phoneResult.length > 0) {
            return reject({
                status: 401,
                message: "Phone Number already exists",
            });
        }

        let sql = `INSERT INTO Users (fullName, phone, email, username, password, role, permissions) 
Values (?,? ,?, ?, ?, ?,?)`;
        db.query(
            sql,
            [name, phone, email, username, passwordHash, role,permission],
            function (err: any, data: any) {
                if (err) reject(err);
                resolve({ data: data, message: "Register successfully" });
            }
        );
    });
};

export const changePasswordService = async (data: {
    email: string;
    oldPassword: string;
    newPassword: string;
}): Promise<{ message: string; data: any }> => {
    const { email, oldPassword, newPassword } = data;

    const sql1 = `SELECT * FROM Users WHERE email = ?`;
    const sql2 = `UPDATE Users SET password = ? WHERE email = ?`;

    return new Promise(async (resolve, reject) => {
        const user: any = await new Promise((resolve, reject) => {
            db.query(sql1, [email], (err: any, data: any) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        const check = await bcrypt.compare(oldPassword, user[0].password);

        if (!check) {
            reject({
                status: 401,
                message: "Old password is incorrect",
                data: null,
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        db.query(sql2, [passwordHash, email], (err: any, data: any) => {
            if (err)
                reject({ status: 500, message: "Server Error", data: data });
            resolve({ message: "Change password successfully", data: data });
        });
    });
};
