import db from "../../config/database.config";
import { convertDay } from "../../utils/Order";

import { IShift } from "./shift.interface";

export const getShiftsService = async (): Promise<IShift[]> => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM shifts`, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result as IShift[]);
        });
    });
};

export const addShiftService = async (params: {
    staffId: number;
    staffName: string;
    start: string;
    end: string;
    title: string;
}): Promise<IShift[]> => {
    const { staffId, staffName, start, end, title } = params;

    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO shifts SET ?`, params, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result as IShift[]);
        });
    });
}

export const deleteShiftService = async (shiftID: number): Promise<IShift[]> => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM shifts WHERE id = ?`, shiftID, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result as IShift[]);
        });
    });
}
