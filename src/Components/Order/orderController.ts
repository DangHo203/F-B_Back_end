import { Request, Response } from "express";

import {
    GetSumOrderService,
    GetOrderByParamsService,
    GetOrderByCustomerIdService,
    GetOrderItemsService,
    ChangeStatusService,
    CancelOrderService,
    GetShipperOrderService,
    CreateOrderService,
    AddOrderItemService,
    GetOrderByIdService,
} from "./order.service";
import { convertDay } from "../../utils/Order";

const CreateOrderAPI = async (req: Request, res: Response) => {
    const { user_id, total_price, message, payment_method, address, lng, lat } =
        req.query;
    if (!user_id || !total_price) {
        return res.status(400).json({
            message: "User id and total price is required",
        });
    }
    try {
        const result = await CreateOrderService({
            address: address as string,
            user_id: Number(user_id),
            total_price: Number(total_price),
            message: message as string,
            payment_method: payment_method as string,
            lng: Number(lng),
            lat: Number(lat),
        });
        return res.status(201).json({
            message: "Order created successfully",
            result,
        });
    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const AddOrderItemsAPI = async (req: Request, res: Response) => {
    const { order_id, item_id, quantity } = req.query;
    if (!order_id || !item_id || !quantity) {
        return res.status(400).json({
            message: "Order id, item id and quantity is required",
        });
    }
    try {
        const result = await AddOrderItemService({
            order_id: Number(order_id),
            item_id: Number(item_id),
            quantity: Number(quantity),
        });
        return res.status(201).json({
            message: "Order item added successfully",
            result,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
const GetOrderByCustomerIdAPI = async (req: Request, res: Response) => {
    const { user_id } = req.query;
    try {
        const result = await GetOrderByCustomerIdService({
            user_id: Number(user_id),
        });
        return res.status(200).json({
            message: "Order fetched successfully",
            result,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const GetOrderByIdAPI = async (req: Request, res: Response) => {
    const { order_id } = req.query;
    try {
        const result = await GetOrderByIdService({
            order_id: Number(order_id),
        });
        return res.status(200).json({
            message: "Order fetched successfully",
            result,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const GetSumOrderAPI = async (req: Request, res: Response) => {
    const { search, status, create_at, history } = req.query;
    try {
        const result = await GetSumOrderService({
            search: search as string,
            status: status as string,
            create_at: create_at as string,
            history: history as string,
        });
        return res.status(200).json({
            message: "Sum order fetched successfully",
            result,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
const GetOrderByParamsAPI = async (req: Request, res: Response) => {
    const { page, limit, search, status, create_at, history } = req.query;
    try {
        const result = await GetOrderByParamsService({
            search: search as string,
            status: status as string,
            create_at: create_at as string,
            limit: Number(limit),
            page: Number(page),
            history: history as string,
        });
        return res.status(200).json({
            message: "Order fetched successfully",
            result,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const GetOrderItemsAPI = async (req: Request, res: Response) => {
    const { order_id } = req.query;
    if (!order_id) {
        return res.status(400).json({
            message: "Order id is required",
        });
    }
    try {
        const result = await GetOrderItemsService({
            order_id: Number(order_id),
        });
        return res.status(200).json({
            message: "Order items fetched successfully",
            result,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const ChangeStatusAPI = async (req: Request, res: Response) => {
    const { order_id, status, user_id, delivery_time } = req.query;
    if (!order_id || !status) {
        return res.status(400).json({
            message: "Order id and status is required",
        });
    }

    try {
        const result = await ChangeStatusService({
            order_id: Number(order_id),
            status: status.toString(),
            delivery_time: delivery_time as string,
            user_id: Number(user_id),
        });
        return res.status(200).json({
            message: "Status updated successfully",
            result,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const CancelOrderAPI = async (req: Request, res: Response) => {
    const { order_id, message } = req.query;

    if (!order_id) {
        return res.status(400).json({
            message: "Order id is required",
        });
    }
    try {
        const result = await CancelOrderService({
            order_id: Number(order_id),
            status: "Cancelled",
            message: message as string,
        });
        return res.status(200).json({
            message: "Order cancelled successfully",
            result,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

const GetShipperOrderAPI = async (req: Request, res: Response) => {
    const { user_id } = req.query;
    try {
        const result = await GetShipperOrderService({
            shipper_id: Number(user_id),
        });
        return res.status(200).json({
            message: "Order fetched successfully",
            result,
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export {
    CreateOrderAPI,
    GetOrderByCustomerIdAPI,
    GetSumOrderAPI,
    GetOrderByParamsAPI,
    GetOrderItemsAPI,
    ChangeStatusAPI,
    CancelOrderAPI,
    GetShipperOrderAPI,
    AddOrderItemsAPI,
    GetOrderByIdAPI,
};
