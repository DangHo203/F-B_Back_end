import db from "../../config/database.config";
type TotalOrderResult = { total_order: number };
type TotalProfitResult = { profit: string };
type TotalUserResult = { total_user: number };
type TotalViewResult = { total_view: number };
type TotalOrderLastMonthResult = { total_order: number };
type TotalProfitLastMonthResult = { profit: string };
type TotalUserLastMonthResult = { total_user: number };
type TotalViewLastMonthResult = { total_view: number };

export const GetTotalViewLastMonthService = async (): Promise<
    TotalViewLastMonthResult[]
> => {
    const query = `SELECT COUNT(create_at) as total_view FROM views WHERE create_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) and create_at < CURDATE()`;

    try {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result as TotalViewLastMonthResult[]);
                }
            });
        });
    } catch (err) {
        console.error("Error executing queries:", err);
        throw err;
    }
};

export const GetTotalOrderLastMonthService = async (): Promise<
    TotalOrderLastMonthResult[]
> => {
    const query = `SELECT COUNT(order_id) as total_order FROM orders WHERE create_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) and create_at < CURDATE()`;

    try {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result as TotalOrderLastMonthResult[]);
                }
            });
        });
    } catch (err) {
        console.error("Error executing queries:", err);
        throw err;
    }
};

export const GetTotalUserLastMonthService = async (): Promise<
    TotalUserLastMonthResult[]
> => {
    const query = `SELECT COUNT(user_id) as total_user FROM users WHERE create_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) and create_at < CURDATE()`;

    try {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result as TotalUserLastMonthResult[]);
                }
            });
        });
    } catch (err) {
        console.error("Error executing queries:", err);
        throw err;
    }
};
export const GetTotalProfitLastMonthService = async (): Promise<
    TotalProfitLastMonthResult[]
> => {
    const query = `SELECT SUM(total_price) as profit FROM orders WHERE status = 'Successfully' and create_at >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH) and create_at < CURDATE()`;

    try {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result as TotalProfitLastMonthResult[]);
                }
            });
        });
    } catch (err) {
        console.error("Error executing queries:", err);
        throw err;
    }
};
export const GetTotalViewCurrentMonthService = async (): Promise<
    TotalViewResult[]
> => {
    const query = `SELECT COUNT(create_at) as total_view FROM views WHERE MONTH(create_at) = MONTH(CURDATE()) AND YEAR(create_at) = YEAR(CURDATE())`;

    try {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result as TotalViewResult[]);
                }
            });
        });
    } catch (err) {
        console.error("Error executing queries:", err);
        throw err;
    }
};

export const GetTotalOrderCurrentMonthService = async (): Promise<
    TotalOrderResult[]
> => {
    const query = `SELECT COUNT(order_id) as total_order FROM orders WHERE MONTH(create_at) = MONTH(CURDATE()) AND YEAR(create_at) = YEAR(CURDATE())`;

    try {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result as TotalOrderResult[]);
                }
            });
        });
    } catch (err) {
        console.error("Error executing queries:", err);
        throw err;
    }
};

export const GetTotalUserCurrentMonthService = async (): Promise<
    TotalUserResult[]
> => {
    const query = `SELECT COUNT(user_id) as total_user FROM users WHERE MONTH(create_at) = MONTH(CURDATE()) AND YEAR(create_at) = YEAR(CURDATE())`;

    try {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result as TotalUserResult[]);
                }
            });
        });
    } catch (err) {
        console.error("Error executing queries:", err);
        throw err;
    }
};

export const GetTotalProfitCurrentMonthService = async (): Promise<
    TotalProfitResult[]
> => {
    const query = `SELECT SUM(total_price) as profit FROM orders WHERE status = 'Successfully' AND MONTH(create_at) = MONTH(CURDATE()) AND YEAR(create_at) = YEAR(CURDATE())`;

    try {
        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result as TotalProfitResult[]);
                }
            });
        });
    } catch (err) {
        console.error("Error executing queries:", err);
        throw err;
    }
};
