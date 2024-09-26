import { Router } from "express";
import {
    AddMenu,
    DeleteMenu,
    UpdateMenu,
    GetMenuById,
    GetMenuByParams,
    GetSumMenuByParams,
} from "./menuController";
const router = Router();

router.post("/", AddMenu);
router.put("/", UpdateMenu);
router.delete("/", DeleteMenu);

router.get("/id", GetMenuById);
router.get("/", GetMenuByParams);
router.get("/sum", GetSumMenuByParams);

export default router;
