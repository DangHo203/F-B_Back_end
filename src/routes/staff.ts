import { Router } from "express";
const router = Router();

const {
    AddStaff,
    UpdateStaff,
    DeleteStaff,
    GetSumStaff,
    GetStaffsByParams,
} = require("../controllers/user");

router.get("/getSumStaff", GetSumStaff);
router.get("/getStaffByParams", GetStaffsByParams);
router.post("/addStaff", AddStaff);
router.delete("/deleteStaff", DeleteStaff);
router.put("/updateStaff", UpdateStaff);

export default router;
