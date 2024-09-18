import db from "../dbConfig";
import bcrypt from "bcrypt";

interface User {
    _id: number;
    email: string;
    password: string;
    role: string;
    refreshToken: string;
}

import { generateToken, generateRefreshToken } from "../middlewares/jwt";
export const loginUser = async (
    email: string,
    password: string
): Promise<{ user: User; token: string; refreshToken: string }> => {
    const sql = `SELECT * FROM User WHERE email = ?`;

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

            if (data[0].role !== "admin" || data[0].status === "banned") {
                return reject({
                    status: 402,
                    message: "You are not allowed to login",
                });
            }

            const token = generateToken(data[0]?._id, data[0]?.role);
            const refreshToken = generateRefreshToken(data[0]?._id);

            const updateRefreshTokenSql = `UPDATE User SET refreshToken = ? WHERE _id = ?`;
            db.query(
                updateRefreshTokenSql,
                [refreshToken, data[0]._id],
                function (err: any) {
                    if (err) return reject(err);
                }
            );

            resolve({ user: data[0], token, refreshToken });
        });
    });
};

export const registerUser = async (data: {
    name: string;
    email: string;
    password: string;
    address: string;
    phoneNumber: string;
    gen: boolean;
    birth: string;
}): Promise<{ message: string; data: any }> => {
    const { name, email, password, address, phoneNumber, gen, birth } = data;
    //hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password.toString(), salt);

    return new Promise(async (resolve, reject) => {
        const emailQuery = "SELECT * FROM User WHERE email = ?";
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
        const phoneQuery = "SELECT * FROM User WHERE phoneNumber = ?";
        const phoneResult: [] = await new Promise((resolve, reject) => {
            db.query(phoneQuery, [phoneNumber], (err: any, data: any) => {
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

        let sql = `INSERT INTO User (name, phoneNumber, email, address,gender, birth, password, role) 
Values (?,? ,?, ?, ?, ?, ?, ?)`;

        db.query(
            sql,
            [
                name,
                phoneNumber,
                email,
                address,
                gen,
                birth,
                passwordHash,
                "admin",
            ],
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

    const sql1 = `SELECT * FROM User WHERE email = ?`;
    const sql2 = `UPDATE User SET password = ? WHERE email = ?`;

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
