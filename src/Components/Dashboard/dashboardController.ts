import { Request, Response } from "express";
import {
    GetTotalOrderCurrentMonthService,
    GetTotalProfitCurrentMonthService,
    GetTotalUserCurrentMonthService,
    GetTotalViewCurrentMonthService,
    GetTotalOrderLastMonthService,
    GetTotalProfitLastMonthService,
    GetTotalUserLastMonthService,
    GetTotalViewLastMonthService,
} from "./dashboard.service";
import db from "../../config/database.config";

export const GetTotalAllAPI = async (req: Request, res: Response) => {
    try {
        const result1 = await GetTotalOrderCurrentMonthService();
        const result2 = await GetTotalProfitCurrentMonthService();
        const result3 = await GetTotalUserCurrentMonthService();
        const result4 = await GetTotalViewCurrentMonthService();
        const result5 = await GetTotalOrderLastMonthService();
        const result6 = await GetTotalProfitLastMonthService();
        const result7 = await GetTotalUserLastMonthService();
        const result8 = await GetTotalViewLastMonthService();

        // Return a structured JSON response
        return res.status(200).json({
            message: "Total fetched successfully",
            currentMonth: {
                total_order: result1[0]?.total_order || 0,
                total_profit: result2[0]?.profit || 0,
                total_user: result3[0]?.total_user || 0,
                total_view: result4[0]?.total_view || 0,
            },
            lastMonth: {
                total_order: result5[0]?.total_order || 0,
                total_profit: result6[0]?.profit || 0,
                total_user: result7[0]?.total_user || 0,
                total_view: result8[0]?.total_view || 0,
            },
        });
    } catch (err: any) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const IncreaseViewAPI = async (req: Request, res: Response) => {
    const create_at = new Date();
    try {
        const query = `insert into Views (create_at) values (now())`;

        db.query(query, create_at, (err, result) => {
            if (err) {
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            }
            return res.status(200).json({
                message: "View updated successfully",
                result,
            });
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
