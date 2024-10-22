import { Router } from "express";
import { IncreaseViewAPI, GetTotalAllAPI } from "./dashboardController";

const router = Router();

router.post("/view", IncreaseViewAPI);
router.get("/total", GetTotalAllAPI);
export default router;  