import { Router } from "express";

const {
    GetCustomersByParams,
    updateStatus,
    GetSumCustomer,
    GetUserById,
    GetShipper
} = require("./userController");
const {
    Login,
    Register,
    createNewAccessToken,
    changePassword,
} = require("../Auth/authController");

const router = Router();
const { isAdmin } = require("../../middlewares/is-admin");
const { verifyToken } = require("../../middlewares/verify-token");
//request

//login/register
router.post("/login", Login);
router.post("/register", Register);

//admin
router.get("/getSumCustomer", verifyToken, GetSumCustomer);
router.get("/getCustomerByParams", verifyToken, GetCustomersByParams);
router.put("/changePassword", changePassword);
router.get("/getCustomerById", verifyToken, GetUserById);

router.get("/token", createNewAccessToken);
router.post("/status", verifyToken, updateStatus);

router.get("/shipper", GetShipper);

export default router;
