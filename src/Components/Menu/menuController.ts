import { Request, Response } from "express";
import {
    AddMenuService,
    DeleteMenuService,
    GetMenuByParamsService,
    UpdateMenuService,
    GetMenuByIdService,
    GetSumMenuByParamsService,
} from "./menu.service";

const AddMenu = async (req: Request, res: Response) => {
    const { title, price, description, image, category } = req.query;
    if (!title || !price || !description || !image || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await AddMenuService({
            title: title as string,
            price: Number(price),
            description: description as string,
            image: image as string,
            category: category as string,
        });
        return res
            .status(201)
            .json({ message: "Menu added successfully", data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

const UpdateMenu = async (req: Request, res: Response) => {
    const { title, price, description, image, category, m_id } = req.query;
    if (!title || !price || !description || !image || !category || !m_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await UpdateMenuService({
            title: title as string,
            price: Number(price),
            description: description as string,
            image: image as string,
            category: category as string,
            id: Number(m_id),
        });
        return res
            .status(200)
            .json({ message: "Menu updated successfully", data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

const DeleteMenu = async (req: Request, res: Response) => {
    const { m_id } = req.query;
    if (!m_id) {
        return res.status(400).json({ message: "Menu id is required" });
    }
    try {
        const result = await DeleteMenuService(Number(m_id));
        return res
            .status(200)
            .json({ message: "Menu deleted successfully", data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

const GetMenuByParams = async (req: Request, res: Response) => {
    const { page, limit, title, category, availability } = req.query;

    try {
        const result = await GetMenuByParamsService({
            page: Number(page),
            limit: Number(limit),
            title: title as string,
            category: category as string,
            availability: availability as string,
        });
        return res
            .status(200)
            .json({ message: "Menu fetched successfully", data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

const GetSumMenuByParams = async (req: Request, res: Response) => {
    const { title, category, availability } = req.query;
    try {
        const result = await GetSumMenuByParamsService({
            title: title as string,
            category: category as string,
            availability: availability as string,
        });
        return res
            .status(200)
            .json({ message: "Menu fetched successfully", data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

const GetMenuById = async (req: Request, res: Response) => {
    const { m_id } = req.query;
    if (!m_id) {
        return res.status(400).json({ message: "Menu id is required" });
    }
    try {
        const result = await GetMenuByIdService(Number(m_id));
        return res
            .status(200)
            .json({ message: "Menu fetched successfully", data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
};

export {
    AddMenu,
    UpdateMenu,
    DeleteMenu,
    GetMenuByParams,
    GetMenuById,
    GetSumMenuByParams,
};
