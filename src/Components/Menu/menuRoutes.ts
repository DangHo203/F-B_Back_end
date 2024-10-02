import { Router } from "express";
import {
    AddMenu,
    DeleteMenu,
    UpdateMenu,
    GetMenuById,
    GetMenuByParams,
    GetSumMenuByParams,
} from "./menuController";
import uploadCloud from "../../config/cloudinary.config";
const { UploadImage } = require("../User/userController");

const router = Router();

router.post("/", AddMenu);
router.put("/", UpdateMenu);
router.delete("/", DeleteMenu);

router.get("/id", GetMenuById);
router.get("/", GetMenuByParams);
router.get("/sum", GetSumMenuByParams);
router.post("/image",uploadCloud.single("image"), UploadImage);

export default router;
