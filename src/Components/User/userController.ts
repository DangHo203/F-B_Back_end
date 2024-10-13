import db from "../../config/database.config";
import { Request, Response } from "express";
import { GetShipperService } from "./user.service";
const jwt = require("jsonwebtoken");

interface CustomRequest extends Request {
    file: any;
}

const GetShipper = async (req: Request, res: Response) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: "ID is require!" });
    }

    try {
        const rs = await GetShipperService({
            user_id: parseInt(user_id as string),
        });
        return res.status(200).json({
            status: 200,
            message: "Get info successfully",
            rs,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const GetUsers = async (req: Request, res: Response) => {
    let sql = "SELECT * FROM Users";
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
    let sql = `SELECT * FROM Users WHERE user_id = ${_id}`;

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

    let sql = `INSERT INTO Users (name, phoneNumber, email, address, gender, birth, password, role)
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
    const phoneQuery =
        "SELECT * FROM Users WHERE phoneNumber = ? and _id != ? ";
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

    let sql = `DELETE FROM Users WHERE _id = ${_id}`;

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

    let sql = `SELECT * FROM Users WHERE phoneNumber = "${phoneNumber}"`;

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

    const query = `SELECT Count(*) as Sum FROM Users ${
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

    const query = `SELECT * FROM Users ${
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

    let sql = `UPDATE Users SET status = '${status}' WHERE user_id = ${_id}`;

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
//////////////////////////////////CUSTOMER/////////////////////////////////////
const GetAllStaff = async (req: Request, res: Response) => {
    let sql =
        "SELECT * FROM Users WHERE role not like 'user' and role not like 'admin'";
    db.query(sql, function (err: any, data: any) {
        if (err) throw err;
        res.status(200).json({
            message: "Get staff successfully",
            data: data,
        });
    });
};

const GetCustomersByParams = async (req: Request, res: Response) => {
    const queryObj = { ...req.query };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = Array.isArray(req.query.page)
        ? req.query.page[0]
        : req.query.page;
    const skip = page ? (parseInt(page as string) - 1) * 5 : 0;

    const query = `SELECT * FROM Users ${
        Object.keys(queryObj).length === 0 ? "" : "WHERE"
    } ${Object.keys(queryObj)
        .map((key) => {
            if (key === "status") {
                return `status like '${queryObj[key]}'`;
            } else if (key === "role") {
                return `role like '${queryObj[key]}'`;
            } else if (queryObj[key] !== "") {
                return `(user_id like '%${queryObj[key]}%' or fullName like '%${queryObj[key]}%' or phone like '%${queryObj[key]}%' or email like '%${queryObj[key]}%' )`;
            }
        })
        .join(" and ")} ${
        Object.keys(queryObj).length === 0
            ? "WHERE role like 'user'"
            : "and role like 'user'"
    }  LIMIT 5 OFFSET ${skip}`;
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
const GetSumCustomer = async (req: Request, res: Response) => {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = `SELECT Count(*) as Sum FROM Users ${
        Object.keys(queryObj).length === 0 ? "" : "WHERE"
    } ${Object.keys(queryObj)
        .map((key) => {
            if (key === "status") {
                return `status like '${queryObj[key]}'`;
            } else if (key === "role") {
                return `role like '${queryObj[key]}'`;
            } else if (queryObj[key] !== "") {
                return `(user_id like '%${queryObj[key]}%' or fullName like '%${queryObj[key]}%' or phone like '%${queryObj[key]}%' or email like '%${queryObj[key]}%' )`;
            }
        })
        .join(" AND ")} ${
        Object.keys(queryObj).length === 0
            ? "WHERE role like 'user'"
            : "and role like 'user'"
    } LIMIT 100000 OFFSET 0`;
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

//////////////////STAFF///////////////////////
const checkValid = (email: string, phone: string) => {
    const query = `SELECT * FROM Users WHERE email = "${email}"`;
    db.query(query, function (err: any, data: any) {
        if (err) throw err;
        if (data.length > 0) {
            return 410;
        }
    });
    const query2 = `SELECT * FROM Users WHERE phone = "${phone}"`;
    db.query(query2, function (err: any, data: any) {
        if (err) throw err;
        if (data.length > 0) {
            return 411;
        }
    });
    return 200;
};

const AddStaff = async (req: Request, res: Response) => {
    const { name, phone, email, username, role } = req.query;
    if (!name || !phone || !email || !username || !role) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    console.log(req.query.permission);
    const permission = req.query.permission
        ? JSON.stringify(req?.query.permission)
        : "";
    const query = `INSERT INTO Users (fullName, phone, email, username, role, permissions) VALUES ("${name}","${phone}","${email}","${username}","${role}", '${permission}')`;
    if (checkValid(email as string, phone as string) === 410) {
        return res.status(410).json({ message: "Email is already exist" });
    } else if (checkValid(email as string, phone as string) === 411) {
        return res
            .status(411)
            .json({ message: "Phone number is already exist" });
    }
    try {
        db.query(query, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                message: "Add staff successfully",
                data: data,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
const UpdateStaff = async (req: Request, res: Response) => {
    const { user_id, name, phone, email, username, role, status } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: "ID is require!" });
    }

    let sql = `UPDATE Users SET fullName = "${name}", phone = "${phone}", email = "${email}", username = "${username}", role = "${role}", status ="${status}" WHERE user_id = ${user_id}`;
    if (checkValid(email as string, phone as string) === 410) {
        return res.status(410).json({ message: "Email is already exist" });
    } else if (checkValid(email as string, phone as string) === 411) {
        return res
            .status(411)
            .json({ message: "Phone number is already exist" });
    }

    try {
        db.query(sql, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                status: 200,
                message: "Update staff successfully",
                data: data,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const UpdatePermission = async (req: Request, res: Response) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: "ID is require!" });
    }
    
    console.log(req.query.permission);
    let permission = req.query.permission
        ? JSON.stringify(req?.query.permission)
        : "";

    if (permission === "") {
        permission = "[]";
    }
    let sql = `UPDATE Users SET permissions = '${permission}' WHERE user_id = ${user_id}`;

    try {
        db.query(sql, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                message: "Update permission successfully",
                data: data,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const DeleteStaff = async (req: Request, res: Response) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: "ID is require!" });
    }

    let sql = `DELETE FROM Users WHERE user_id = ${user_id}`;

    try {
        db.query(sql, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                message: "Delete staff successfully",
                data: data,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

const GetSumStaff = async (req: Request, res: Response) => {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const query = `SELECT Count(*) as Sum FROM Users ${
        Object.keys(queryObj).length === 0 ? "" : "WHERE"
    } ${Object.keys(queryObj)
        .map((key) => {
            if (key === "status") {
                return `status like '${queryObj[key]}'`;
            } else if (key === "role") {
                return `role like '${queryObj[key]}'`;
            } else if (queryObj[key] !== "") {
                return `(user_id like '%${queryObj[key]}%' or fullName like '%${queryObj[key]}%' or phone like '%${queryObj[key]}%' or email like '%${queryObj[key]}%' or username like '%${queryObj[key]}')`;
            }
        })
        .join(" AND ")} ${
        Object.keys(queryObj).length === 0
            ? "WHERE role not like 'user'"
            : "and role not like 'user'"
    } LIMIT 100000 OFFSET 0`;
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

const GetStaffsByParams = async (req: Request, res: Response) => {
    const queryObj = { ...req.query };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const page = Array.isArray(req.query.page)
        ? req.query.page[0]
        : req.query.page;
    const skip = page ? (parseInt(page as string) - 1) * 5 : 0;

    const query = `SELECT * FROM Users ${
        Object.keys(queryObj).length === 0 ? "" : "WHERE"
    } ${Object.keys(queryObj)
        .map((key) => {
            if (key === "status") {
                return `status like '${queryObj[key]}'`;
            } else if (key === "role") {
                return `role like '${queryObj[key]}'`;
            } else if (queryObj[key] !== "") {
                return `(user_id like '%${queryObj[key]}%' or fullName like '%${queryObj[key]}%' or phone like '%${queryObj[key]}%' or email like '%${queryObj[key]}%' )`;
            }
        })
        .join(" and ")} ${
        Object.keys(queryObj).length === 0
            ? "WHERE role not like 'user'"
            : "and role not like 'user'"
    }  LIMIT 5 OFFSET ${skip}`;
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
const UpdateProfile = async (req: Request, res: Response) => {
    const { user_id, name, phone, email, username, role, image } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: "ID is require!" });
    }

    let sql = `UPDATE Users SET fullName = "${name}", phone = "${phone}", email = "${email}", image = "${image}" WHERE user_id = ${user_id}`;
    if (checkValid(email as string, phone as string) === 410) {
        return res.status(410).json({ message: "Email is already exist" });
    } else if (checkValid(email as string, phone as string) === 411) {
        return res
            .status(411)
            .json({ message: "Phone number is already exist" });
    }

    try {
        db.query(sql, function (err: any, data: any) {
            if (err) throw err;
            res.status(200).json({
                status: 200,
                message: "Update staff successfully",
                data: data,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
const UploadImage = async (req: CustomRequest, res: Response) => {
    return res.status(200).json({
        message: "Upload image successfully",
        data: req.file,
    });
};

export = {
    AddUser,
    GetUsers,
    DeleteUser,
    UpdateUser,
    GetUserById,
    CheckPhoneNumber,
    GetSumUser,
    GetUsersByParams,
    updateStatus,
    GetCustomersByParams,
    GetSumCustomer,

    AddStaff,
    UpdateStaff,
    DeleteStaff,
    GetSumStaff,
    GetStaffsByParams,
    UpdateProfile,
    UploadImage,
    UpdatePermission,

    GetShipper,
    GetAllStaff,
};
