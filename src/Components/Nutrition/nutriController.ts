import { Request, Response } from "express";

import {
    AddNutritionService,
    GetNutritionService,
    UpdateNutritionService,
} from "./nutri.service";

const GetNutrition = async (req: Request, res: Response) => {
    const { item_id } = req.query;
    if (!item_id) {
        return res.status(400).json({ message: "Item id is required" });
    }
    try {
        const result = await GetNutritionService(Number(item_id));
        return res
            .status(200)
            .json({ message: "Nutrition fetched successfully", data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};
const AddNutrition = async (req: Request, res: Response) => {
    const { item_id, calories, carbs, proteins, fats } = req.query;
    console.log(item_id, calories, carbs, proteins, fats);
    if (!item_id || !calories || !carbs || !proteins || !fats) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await AddNutritionService({
            item_id: Number(item_id),
            calories: Number(calories),
            carbs: Number(carbs),
            proteins: Number(proteins),
            fats: Number(fats),
        });
        return res
            .status(201)
            .json({ message: "Nutrition added successfully", data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};
const UpdateNutrition = async (req: Request, res: Response) => {
    const { nutritional_info_id, calories, carbs, proteins, fats } = req.query;
    if (!nutritional_info_id || !calories || !carbs || !proteins || !fats) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await UpdateNutritionService({
            nutritional_info_id: Number(nutritional_info_id),
            calories: Number(calories),
            carbs: Number(carbs),
            proteins: Number(proteins),
            fats: Number(fats),
        });
        return res
            .status(200)
            .json({ message: "Nutrition updated successfully", data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

export { GetNutrition, AddNutrition, UpdateNutrition };
