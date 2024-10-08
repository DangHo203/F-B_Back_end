import db from "../../config/database.config";
import { convertDay } from "../../utils/Order";
import { IOrder, IOrderItem } from "./order.interface";

export const GetSumOrderService = (params: {
    search: string;
    status: string;
    create_at: string;
    history: string;
}) => {
    const { search, status, create_at, history } = params;
    return new Promise((resolve, reject) => {
        let query = `SELECT Count(*) as Sum FROM orders WHERE 1=1 `;
        if (search) {
            query += `AND (customer_id LIKE '%${search}%' or order_id like '%${search}%') `;
        }
        if (history !== "1") {
            if (status) {
                query += `AND status LIKE '%${status}%' `;
            }
            query += `AND (status not LIKE 'Delivered' and status not LIKE 'Cancelled') `;
        } else {
            query += `AND status LIKE 'Delivered' or status LIKE 'Cancelled' `;
        }
        if (create_at) {
            query += `AND create_at LIKE '%${create_at}%' `;
        }
        query += ` Limit 100000 OFFSET 0`;
        console.log(query);
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

export const GetOrderByParamsService = (params: {
    search: string;
    status: string;
    create_at: string;
    limit: number;
    page: number;
    history: string;
}): Promise<IOrder[]> => {
    return new Promise((resolve, reject) => {
        const { search, status, create_at, limit, page, history } = params;
        const time = convertDay(create_at) || "";

        let query = `SELECT * FROM orders WHERE 1=1 `;
        if (search) {
            query += `AND (user_id LIKE '%${search}%' or order_id like '%${search}%') `;
        }
        if (history !== "1") {
            if (status) {
                query += `AND status LIKE '%${status}%' `;
            }
            query += `AND (status not LIKE 'Delivered' and status not LIKE 'Cancelled') `;
        } else {
            query += `AND status LIKE 'Delivered' or status LIKE 'Cancelled' `;
        }
        if (create_at) {
            query += `AND create_at >= '${time}' `;
        }

        query += ` Limit ${limit} Offset ${limit * (page - 1)}`;
        console.log(query);
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result as IOrder[]);
        });
    });
};

export const GetOrderByCustomerIdService = (params: {
    order_id: number;
}): Promise<IOrder[]> => {
    const { order_id } = params;
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM orders WHERE order_id = ${order_id}`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result as IOrder[]);
        });
    });
};

export const GetOrderItemsService = (params: {
    order_id: number;
}): Promise<IOrderItem[]> => {
    const { order_id } = params;
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM orderitems join menuitems on orderitems.item_id = menuitems.item_id WHERE order_id = ${order_id}`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result as IOrderItem[]);
        });
    });
};

export const ChangeStatusService = (params: {
    order_id: number;
    status: string;
    delivery_time?: string;
}) => {
    const { order_id, status,delivery_time } = params;
    return new Promise((resolve, reject) => {
        let query = `UPDATE orders SET status = '${status}'`
        if (delivery_time) {
            query += `, delivery_time = NOW() `;
        }
        query+= `WHERE order_id = ${order_id}`;
        console.log(query);
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

export const CancelOrderService = (params: {
    order_id: number;
    status: string;
    message: string;
}) => {
    const { order_id, status, message } = params;
    return new Promise((resolve, reject) => {
        const query = `UPDATE orders SET status = '${status}', message= '${message}' WHERE order_id = ${order_id}`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};
