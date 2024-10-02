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
    UpdateIngredient,
    GetIngredient,
    DeleteAllIngredientsFromMenu
} from "./ingredientController";

const router = Router();

router.get("/all", GetIngredient);
router.get("/id", GetIngredientById);
router.post("/", AddIngredient);
router.delete("/", DeleteIngredient);
router.get("/", GetIngredientByParams);
router.get("/sum", GetSumIngredientByParams);
router.put("/", UpdateIngredient);


router.post("/menu", AddIngredientToMenu);
router.delete("/menu", RemoveIngredientFromMenu);
router.put("/menu", UpdateIngredientFromMenu);
router.get("/menu", GetIngredientsFromMenu);
router.delete("/menu/all", DeleteAllIngredientsFromMenu);


export default router;  