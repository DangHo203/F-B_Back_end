import { Router } from "express";
import uploadCloud from "../../config/cloudinary.config";
const router = Router();

const {
    AddStaff,
    UpdateStaff,
    DeleteStaff,
    GetSumStaff,
    GetStaffsByParams,
    GetUserById,
    UpdateProfile,
    UploadImage,
} = require("../User/userController");

const { verifyToken } = require("../../middlewares/verify-token");

router.get("/getSumStaff", verifyToken, GetSumStaff);
router.get("/getStaffByParams", verifyToken, GetStaffsByParams);
router.post("/addStaff", verifyToken, AddStaff);
router.delete("/deleteStaff", verifyToken, DeleteStaff);
router.put("/updateStaff", verifyToken, UpdateStaff);
router.get("/getStaffById", verifyToken, GetUserById);
router.put("/updateProfile", verifyToken, UpdateProfile);
router.post(
    "/uploadImage",
    verifyToken,
    uploadCloud.single("image"),
    UploadImage
);

export default router;
