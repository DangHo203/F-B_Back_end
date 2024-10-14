import db from "../../config/database.config";
import { INotification } from "./notification.interface";

export const GetNotificationService = (): Promise<INotification[]> => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM notifications`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result as INotification[]);
        });
    });
};

export const AddNotificationService = (params: {
    title: string;
    content: string;
    type: string;
    link: string;
}) => {
    const { title, content, type, link } = params;
    const item = {
        title: title,
        content: content,
        type: type,
        isRead: "0",
        link: link,
        time: new Date().toISOString().slice(0, 19).replace("T", " "),
    };
    return new Promise((resolve, reject) => {
        let query = `INSERT INTO notifications SET ?`;
        db.query(query, item, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};

export const changeIsReadService = (params: {
    nof_id:number
}): Promise<INotification[]> => {
    const { nof_id } = params;
    return new Promise((resolve, reject) => {
        const query = `UPDATE notifications SET isRead = 1 WHERE nof_id = ${nof_id}`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result as INotification[]);
        });
    }
    );
}
