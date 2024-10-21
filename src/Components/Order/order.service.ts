import db from "../../config/database.config";
import { convertDay } from "../../utils/Order";
import { IOrder, IOrderItem } from "./order.interface";

export const CreateOrderService = (params: {
    user_id: number;
    total_price: number;
    message: string;
    payment_method: string;
    address: string;
}) => {
    const data = {
        user_id: params.user_id,
        total_price: params.total_price,
        message: params.message,
        address:  params.address,
        payment_method: params.payment_method,
        create_at: new Date(),
        status: "Pending",
    };
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO orders SET ?`;
        db.query(query, data, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

export const AddOrderItemService = (params: {
    order_id: number;
    item_id: number;
    quantity: number;
}) => {
    const { order_id, item_id, quantity } = params;
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO orderitems SET ?`;
        db.query(query, { order_id, item_id, quantity }, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

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
            query += `AND (status not LIKE 'Cancelled' and status not LIKE 'Successfully') `;
        } else {
            query += `AND status LIKE 'Successfully' or status LIKE 'Cancelled' `;
        }
        if (create_at) {
            query += `AND create_at LIKE '%${create_at}%' `;
        }
        query += ` Limit 100000 OFFSET 0`;
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
            query += `AND ( status not LIKE 'Cancelled' and status not LIKE 'Successfully') `;
        } else {
            query += `AND status LIKE 'Successfully' or status LIKE 'Cancelled' `;
        }
        if (create_at) {
            query += `AND create_at >= '${time}' `;
        }

        query += ` Limit ${limit} Offset ${limit * (page - 1)}`;
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
    user_id?: number;
}) => {
    const { order_id, user_id, status, delivery_time } = params;
    return new Promise((resolve, reject) => {
        let query = `UPDATE orders SET status = '${status}'`;
        if (delivery_time) {
            query += `, delivery_time = NOW() `;
        }
        if (user_id) {
            query += `, shipper_id = ${user_id} `;
        }
        query += ` WHERE order_id = ${order_id}`;
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

export const GetShipperOrderService = (params: {
    shipper_id: number;
}): Promise<IOrder[]> => {
    const { shipper_id } = params;
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM orders WHERE status = 'Delivering' and shipper_id = ${shipper_id}`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result as IOrder[]);
        });
    });
};
