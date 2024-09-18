import db from "../dbConfig";
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");

//services
import {
    loginUser,
    registerUser,
    changePasswordService,
} from "../services/authService";

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
    let { email, password, name, phoneNumber, address, gender, birth } =
        req.query;

    if (!email || !password || !name || !phoneNumber || !address || !birth) {
        return res.status(403).json({ message: "Missing required fields" });
    }
    const gen = gender === "true" ? true : false;

    try {
        const data = await registerUser({
            email: email as string,
            password: password as string,
            name: name as string,
            phoneNumber: phoneNumber as string,
            address: address as string,
            gen: gen,
            birth: birth as string,
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

const GetUsers = async (req: Request, res: Response) => {
    let sql = "SELECT * FROM User";
    db.query(sql, function (err: any, data: any) {
        if (err) throw err;
        res.status(200).json({
            message: "Get users successfully",
            data: data,
        });
    });
};
const GetUserById = async (req: Request, res: Response) => {
    const { _id } = req.query;
    if (!_id) {
        return res.status(400).json({ message: "ID is require!" });
    }
    let sql = `SELECT * FROM User WHERE _id = ${_id}`;

    try {
        db.query(sql, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                message: "Get user by id successfully",
                data: data,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const AddUser = async (req: Request, res: Response) => {
    const { name, phoneNumber, email, address, gender, birth } = req.query;
    if (!name || !phoneNumber || !email || !address || !gender || !birth) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    let gend = req.query.gender === "true" ? true : false;

    let sql = `INSERT INTO User (name, phoneNumber, email, address, gender, birth, password, role)
    VALUES ("${name}","${phoneNumber}","${email}","${address}",${gend},"${birth}", "123456aA", "user");
    `;

    try {
        db.query(sql, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                message: "Add user successfully",
                data: data,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const UpdateUser = async (req: Request, res: Response) => {
    const { _id, name, phoneNumber, address, birth, role } = req.query;
    if (!_id) {
        return res.status(400).json({ message: "ID is require!" });
    }
    let gend = req.query?.gender === "true" ? true : false;

    // Check if phone number exists
    const phoneQuery = "SELECT * FROM User WHERE phoneNumber = ? and _id != ? ";
    const phoneResult: [] = await new Promise((resolve, reject) => {
        db.query(phoneQuery, [phoneNumber, _id], (err: any, data: any) => {
            if (err) return reject(err);
            resolve(data);
        });
    });

    if (phoneResult.length > 0) {
        return res.json({
            status: 401,
            message: "Phone Number already exists",
        });
    }

    let sql = `UPDATE User SET name = "${name}", phoneNumber = "${phoneNumber}", address = "${address}", gender = ${gend}, birth = "${birth}" WHERE _id = ${_id}`;

    try {
        db.query(sql, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                status: 200,
                message: "Update user successfully",
                data: data,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
const DeleteUser = async (req: Request, res: Response) => {
    const { _id } = req.query;
    if (!_id) {
        return res.status(400).json({ message: "ID is require!" });
    }

    let sql = `DELETE FROM User WHERE _id = ${_id}`;

    try {
        db.query(sql, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                message: "Delete user successfully",
                data: data,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const CheckPhoneNumber = async (req: Request, res: Response) => {
    const { phoneNumber } = req.query;
    if (!phoneNumber) {
        return res.status(400).json({ message: "Phone number is require!" });
    }

    let sql = `SELECT * FROM User WHERE phoneNumber = "${phoneNumber}"`;

    try {
        db.query(sql, function (err: any, data: any) {
            if (err) throw err;
            if (data.length > 0) {
                return res
                    .status(400)
                    .json({ status: 400, message: "Phone number is exist!" });
            } else {
                res.status(200).json({
                    status: 200,
                    message: "Phone number is not exist",
                });
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const GetSumUser = async (req: Request, res: Response) => {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = `SELECT Count(*) as Sum FROM User ${
        Object.keys(queryObj).length === 0 ? "" : "WHERE"
    } ${Object.keys(queryObj)
        .map((key) => {
            if (key === "startDay") {
                return `birth >= "${queryObj[key]}-01-01"`;
            } else if (key === "endDay") {
                return `birth <= "${queryObj[key]}-12-31"`;
            } else if (key === "status") {
                return `status like '${queryObj[key]}'`;
            } else if (key === "gender") {
                return queryObj[key] === "male" ? `gender = 0` : `gender = 1`;
            } else if (queryObj[key] !== "") {
                return `(phoneNumber like '%${queryObj[key]}%' or name like '%${queryObj[key]}%' or email like '%${queryObj[key]}%' )`;
            }
        })
        .join(" AND ")} LIMIT 100000 OFFSET 0`;
    console.log(query);
    try {
        db.query(query, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                message: "Get len by params successfully",
                length: data,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
/////////////////////////////////////FILTER/////////////////////////////////////
const GetUsersByParams = async (req: Request, res: Response) => {
    const queryObj = { ...req.query };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = Array.isArray(req.query.page)
        ? req.query.page[0]
        : req.query.page;
    const skip = page ? (parseInt(page as string) - 1) * 10 : 0;
    
    const query = `SELECT * FROM User ${
        Object.keys(queryObj).length === 0 ? "" : "WHERE"
    } ${Object.keys(queryObj)
        .map((key) => {
            if (key === "startDay") {
                return `birth >= "${queryObj[key]}-01-01"`;
            } else if (key === "endDay") {
                return `birth <= "${queryObj[key]}-12-31"`;
            } else if (key === "status") {
                return `status like '${queryObj[key]}'`;
            } else if (key === "gender") {
                return queryObj[key] === "male" ? `gender = 0` : `gender = 1`;
            } else if (queryObj[key] !== "") {
                return `(phoneNumber like '%${queryObj[key]}%' or name like '%${queryObj[key]}%' or email like '%${queryObj[key]}%' )`;
            }
        })
        .join(" and ")} LIMIT 10 OFFSET ${skip}`;
    console.log(query);
    try {
        db.query(query, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                message: "Get users by params successfully",
                data,
                length: data.length,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const updateStatus = async (req: Request, res: Response) => {
    const { _id, status } = req.query;
    if (!_id) {
        return res.status(400).json({ message: "ID is require!" });
    }

    let sql = `UPDATE User SET status = '${status}' WHERE _id = ${_id}`;

    try {
        db.query(sql, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                message: "Update status successfully",
                data: data,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

export = {
    AddUser,
    GetUsers,
    DeleteUser,
    UpdateUser,
    GetUserById,
    Login,
    Register,
    CheckPhoneNumber,   
    GetSumUser,
    GetUsersByParams,
    createNewAccessToken,
    updateStatus,
    changePassword
};
