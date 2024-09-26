import { Router } from "express";
import {
    GetIngredientByParams,
    GetIngredientById,
    AddIngredient,
    DeleteIngredient,
    GetSumIngredientByParams,
    AddIngredientToMenu,
    RemoveIngredientFromMenu,
    UpdateIngredientFromMenu,
    GetIngredientsFromMenu,
} from "./ingredientController";

const router = Router();

router.get("/id", GetIngredientById);
router.post("/", AddIngredient);
router.delete("/", DeleteIngredient);
router.get("/", GetIngredientByParams);
router.get("/sum", GetSumIngredientByParams);


router.post("/menu", AddIngredientToMenu);
router.delete("/menu", RemoveIngredientFromMenu);
router.put("/menu", UpdateIngredientFromMenu);
router.get("/menu", GetIngredientsFromMenu);


export default router;  