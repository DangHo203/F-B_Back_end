import { Router } from "express";

const {
    GetCustomersByParams,
    updateStatus,
    GetSumCustomer,
    GetUserById,
} = require("./userController");
const {
    Login,
    Register,
    createNewAccessToken,
    changePassword,
} = require("../Auth/authController");

const router = Router();
const { isAdmin } = require("../../middlewares/isAdmin");
const { verifyToken } = require("../../middlewares/verifyToken");
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

export default router;
