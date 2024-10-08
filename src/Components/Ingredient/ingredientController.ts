import { Request, Response } from "express";

import {
    GetIngredientService,
    AddIngredientService,
    DeleteIngredientService,
    GetIngredientByIdService,
    GetIngredientByParamsService,
    GetSumIngredientByParamsService,
    UpdateIngredientService,
} from "./ingredient.service";

import {
    AddIngredientToMenuService,
    RemoveIngredientFromMenuService,
    UpdateIngredientFromMenuService,
    GetIngredientFromMenuService,
    DeleteAllIngredientsFromMenuService,
} from "./listIngredient.service";

const GetIngredient = async (req: Request, res: Response) => {
    try {
        const result = await GetIngredientService();
        return res
            .status(200)
            .json({ message: "Ingredients fetched successfully", result });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

const GetIngredientByParams = async (req: Request, res: Response) => {
    const { search, is_available, page, limit } = req.query;

    try {
        const result = await GetIngredientByParamsService({
            search: search as string,
            is_available: is_available as string,
            page: Number(page),
            limit: Number(limit),
        });
        console.log(result);
        return res
            .status(200)
            .json({ message: "Ingredients fetched successfully", result });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
const GetSumIngredientByParams = async (req: Request, res: Response) => {
    const { search, is_available } = req.query;
    console.log(search, is_available);
    try {
        const result = await GetSumIngredientByParamsService({
            search: search as string,
            is_available: is_available as string,
        });
        return res
            .status(200)
            .json({ message: "Ingredients fetched successfully", result });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
const GetIngredientById = async (req: Request, res: Response) => {
    const { i_id } = req.query;
    if (!i_id) {
        return res.status(400).json({ message: "Ingredient id is required" });
    }
    try {
        const result = await GetIngredientByIdService(Number(i_id));
        return res
            .status(200)
            .json({ message: "Ingredient fetched successfully", result });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const AddIngredient = async (req: Request, res: Response) => {
    const { name, stock, is_available, unit } = req.query;
    console.log(name, stock, is_available, unit);
    if (!name || !stock || !is_available) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await AddIngredientService({
            name: name as string,
            stock: Number(stock),
            is_available: Boolean(is_available),
            unit: unit as string,
        });
        return res
            .status(201)
            .json({ message: "Ingredient added successfully", result });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const DeleteIngredient = async (req: Request, res: Response) => {
    const { i_id } = req.query;
    if (!i_id) {
        return res.status(400).json({ message: "Ingredient id is required" });
    }
    try {
        const result = await DeleteIngredientService(Number(i_id));
        return res
            .status(200)
            .json({ message: "Ingredient deleted successfully", result });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const UpdateIngredient = async (req: Request, res: Response) => {
    const { i_id, name, stock, is_available, unit } = req.query;
    if (!i_id || !name || !stock || !is_available) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await UpdateIngredientService({
            ingredient_id: Number(i_id),
            name: name as string,
            stock: Number(stock),
            is_available: Boolean(is_available),
            unit: unit as string,
        });
        return res
            .status(200)
            .json({ message: "Ingredient updated successfully", result });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

//List Ingredient
const AddIngredientToMenu = async (req: Request, res: Response) => {
    const { item_id, ingredient_id, quantity_required } = req.query;
    if (!item_id || !ingredient_id || !quantity_required) {
        return res
            .status(400)
            .json({ message: "Ingredient id and Menu id is required" });
    }
    try {
        const result = await AddIngredientToMenuService({
            item_id: Number(item_id),
            ingredient_id: Number(ingredient_id),
            quantity_required: Number(quantity_required),
        });
        return res
            .status(201)
            .json({ message: "Ingredient added to menu successfully", result });
    } catch (err: any) {
        console.log(err);
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({code: 'ER_DUP_ENTRY', message: "Ingredient already exists" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
};
const RemoveIngredientFromMenu = async (req: Request, res: Response) => {
    const { menu_item_ingredient_id } = req.query;
    if (!menu_item_ingredient_id) {
        return res
            .status(400)
            .json({ message: "Menu item ingredient id is required" });
    }
    try {
        const result = await RemoveIngredientFromMenuService({
            menu_item_ingredient_id: Number(menu_item_ingredient_id),
        });
        return res.status(200).json({
            message: "Ingredient removed from menu successfully",
            result,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
const UpdateIngredientFromMenu = async (req: Request, res: Response) => {
    const { menu_item_ingredient_id, quantity_required } = req.query;
    if (!menu_item_ingredient_id || !quantity_required) {
        return res.status(400).json({
            message:
                "Menu item ingredient id and quantity required is required",
        });
    }
    try {
        const result = await UpdateIngredientFromMenuService({
            menu_item_ingredient_id: Number(menu_item_ingredient_id),
            quantity_required: Number(quantity_required),
        });
        return res.status(200).json({
            message: "Ingredient updated in menu successfully",
            result,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
const GetIngredientsFromMenu = async (req: Request, res: Response) => {
    const { item_id } = req.query;
    if (!item_id) {
        return res.status(400).json({ message: "Item id is required" });
    }
    try {
        const result = await GetIngredientFromMenuService({
            item_id: Number(item_id),
        });
        return res
            .status(200)
            .json({ message: "Ingredients fetched successfully", result });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
const DeleteAllIngredientsFromMenu = async (req: Request, res: Response) => {
    const { item_id } = req.query;
    if (!item_id) {
        return res.status(400).json({ message: "Item id is required" });
    }
    try {
        const result = await DeleteAllIngredientsFromMenuService({
            item_id: Number(item_id),
        });

        return res
            .status(200)
            .json({ message: "Ingredients deleted all successfully", result });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export {
    GetIngredient,
    GetIngredientByParams,
    GetIngredientById,
    AddIngredient,
    DeleteIngredient,
    UpdateIngredient,
    GetSumIngredientByParams,
    AddIngredientToMenu,
    RemoveIngredientFromMenu,
    UpdateIngredientFromMenu,
    GetIngredientsFromMenu,
    DeleteAllIngredientsFromMenu
};
