import { Request, Response } from "express";

import { GetNotificationService, AddNotificationService, changeIsReadService } from "./notification.service";

const GetAllNotification = async (req: Request, res: Response) => {
    try {
        const result = await GetNotificationService();
        return res
            .status(200)
            .json({ message: "Notification fetched successfully", data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

const AddNotification = async (req: Request, res: Response) => {
    const { title, content,type, link } = req.query;
    if (!title || !content || !type || !link) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await AddNotificationService({
            title: title.toString(),
            content: content.toString(),
            type: type.toString(),
            link: link.toString(),
        });
        return res
            .status(201)
            .json({ message: "Notification added successfully", data: [] });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

const ChangeIsRead = async (req: Request, res: Response) => {
    const { nof_id } = req.query;
    if (!nof_id) {
        return res.status(400).json({ message: "Notification id is required" });
    }
    try {
        const result = await changeIsReadService({
            nof_id: Number(nof_id),
        });
        return res
            .status(200)
            .json({ message: "Notification updated successfully", data: result });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export { GetAllNotification, AddNotification, ChangeIsRead };