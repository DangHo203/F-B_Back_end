import db from "../../config/database.config";
const AddMenuService = (menu: {
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
}) => {
    return new Promise((resolve, reject) => {
        const { title, price, description, image, category } = menu;
        const query = `INSERT INTO menuitems (title, price, description, image, category) VALUES (?, ?, ?, ?,?)`;
        db.query(
            query,
            [title, price, description, image, category],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

const UpdateMenuService = (menu: {
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
    id: number;
}) => {
    return new Promise((resolve, reject) => {
        const { title, price, description, image, category, id } = menu;
        const query = `UPDATE menuitems SET title=?, price=?, description=?, image=?, category=? WHERE item_id=?`;
        db.query(
            query,
            [title, price, description, image, category, id],
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        );
    });
};

const DeleteMenuService = (id: number) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM menuitems WHERE item_id=?`;
        db.query(query, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
const GetMenuByParamsService = (params: {
    page: number;
    limit: number;
    title: string;
    category: string;
    availability: string;
}) => {
    const { page, limit, title, category, availability } = params;
    const numberPage = (page - 1) * limit;

    let query = `SELECT * FROM menuitems `;
    let queryParams = [];
    if (title || category || availability !== undefined) {
        let conditions = [];

        if (title) {
            conditions.push(`title LIKE ?`);
            queryParams.push(`%${title}%`);
        }
        if (category) {
            conditions.push(`category = ?`);
            queryParams.push(category);
        }
        if (availability !== undefined) {
            conditions.push(`availability = ?`);
            queryParams.push(availability);
        }

        query += `WHERE ` + conditions.join(" AND ");
    }
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, numberPage);

    return new Promise((resolve, reject) => {
        db.query(query, queryParams, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const GetSumMenuByParamsService = (params: {
    title: string;
    category: string;
    availability: string;
}) => {
    const { title, category, availability } = params;
    // const query = `SELECT Count(*) as Sum FROM menuitems ${
    //     title || category || availability ? `WHERE ` : ` `
    // }  ${title ? `title like '%${title}%' AND ` : ""}  ${
    //     category ? `category='${category}' AND ` : ""
    // }  ${
    //     availability ? `availability='${availability}'` : ""
    // } LIMIT 10000 OFFSET 0`;
    let query = `SELECT Count(*) as Sum FROM menuitems `;
    let queryParams = [];
    if (title || category || availability !== undefined) {
        const conditions = [];
        if (title) {
            conditions.push(`title LIKE ?`);
            queryParams.push(`%${title}%`);
        }
        if (category) {
            conditions.push(`category = ?`);
            queryParams.push(category);
        }
        if (availability !== undefined) {
            conditions.push(`availability = ?`);
            queryParams.push(availability);
        }
        query += `WHERE ` + conditions.join(" AND ");
    }
    query += ` LIMIT 10000 OFFSET 0`;

    return new Promise((resolve, reject) => {
        db.query(query, queryParams, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const GetMenuByIdService = (id: number) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM menuitems WHERE item_id=?`;
        db.query(query, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};



const GetSpecialMenuService = () => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM menuitems WHERE category="Special"`;
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export {
    AddMenuService,
    UpdateMenuService,
    DeleteMenuService,
    GetMenuByParamsService,
    GetSumMenuByParamsService,
    GetMenuByIdService,
    GetSpecialMenuService
};
