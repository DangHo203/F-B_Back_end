import { Router } from "express";

import { AddNutrition, GetNutrition, UpdateNutrition } from "./nutriController";
const router = Router();

router.get("/", GetNutrition);
router.post("/", AddNutrition);
router.put("/", UpdateNutrition);




export default router;