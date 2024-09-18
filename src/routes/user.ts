import { Router } from "express";
const {
    AddUser,
    GetUsers,
    DeleteUser,
    UpdateUser,
    GetUserById,
    Login,
    Register,
    CheckPhoneNumber,

    GetUsersByParams,
    createNewAccessToken,
    updateStatus,
    GetSumUser,
    changePassword
} = require("../controllers/user");
const router = Router();
const { isAdmin } = require("../middlewares/isAdmin");
const { verifyToken } = require("../middlewares/verifyToken");
//request

//login/register
router.post("/login", Login);
router.post("/register", Register);

//admin
router.get("/getSumUser", [verifyToken, isAdmin], GetSumUser);
router.get("/getUser", [verifyToken, isAdmin], GetUsers);
router.get("/getUsersByParams", [verifyToken, isAdmin], GetUsersByParams);
router.get("/getUserById", [verifyToken, isAdmin], GetUserById);
router.post("/addUser", [verifyToken, isAdmin], AddUser);
router.delete("/deleteUser", [verifyToken, isAdmin], DeleteUser);
router.put("/updateUser", [verifyToken, isAdmin], UpdateUser);
router.post("/checkPhoneNumber", [verifyToken, isAdmin], CheckPhoneNumber);
router.get("/token", createNewAccessToken);
router.post("/status", [verifyToken, isAdmin], updateStatus);
router.put("/changePassword", changePassword);

export default router;
