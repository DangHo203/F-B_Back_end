import db from "../../config/database.config";
const GetIngredientService = () => {
    const query = `SELECT * FROM ingredients`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
const AddIngredientService = (ingredient: {
    name: string;
    stock: number;
    is_available: boolean;
    unit: string;
}) => {
    const query = `INSERT INTO ingredients SET ?`;

    return new Promise((resolve, reject) => {
        db.query(query, ingredient, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const DeleteIngredientService = (i_id: number) => {
    const query = `DELETE FROM ingredients WHERE ingredient_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, i_id, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const GetIngredientByIdService = (i_id: number) => {
    const query = `SELECT * FROM ingredients WHERE ingredient_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, i_id, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
const GetIngredientByParamsService = (params: {
    search: string;
    is_available: string;
    page: number;
    limit: number;
}) => {
    const { search, is_available, page, limit } = params;
    const numberPage = (page - 1) * limit;
    // const query = `SELECT * FROM ingredients ${
    //     search || is_available ? "WHERE" : " "
    // } ${search ? `ingredient_id = ${search} And name = ${search} OR ` : " "}   ${
    //     is_available ? `is_available = ${is_available} or` : " "
    // } LIMIT ${limit} OFFSET ${numberPage}`;
    let query = `SELECT * FROM ingredients`;
    let queryParams = [];

    if (search || is_available !== undefined) {
        let conditions = [];

        if (search) {
            conditions.push(`ingredient_id = ? OR name LIKE ?`);
            queryParams.push(search, `%${search}%`);
        }
        if (is_available !== undefined) {
            conditions.push(`is_available = ?`);
            queryParams.push(is_available === "true" ? 1 : 0);
        }

        query += ` WHERE ` + conditions.join(" AND ");
    }
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, numberPage);
    console.log(query);

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
const GetSumIngredientByParamsService = (params: {
    search: string;
    is_available: string;
}) => {
    const { search, is_available } = params;
    // const query = `SELECT COUNT(*) as total FROM ingredients ${
    //     search || is_available ? "WHERE" : " "
    // } ${search ? `(ingredient_id = ${search} And name = ${search}) and ` : " "}   ${
    //     is_available ? `is_available = ${is_available} ` : " "
    // } `;
    console.log(search, is_available);
    let query = `SELECT Count(*) as Sum FROM ingredients`;
    let queryParams = [];

    if (search || is_available !== undefined) {
        let conditions = [];

        if (search) {
            conditions.push(`ingredient_id = ? OR name LIKE ?`);
            queryParams.push(search, `%${search}%`);
        }
        if (is_available) {
            conditions.push(`is_available = ?`);
            queryParams.push(is_available === "true" ? 1 : 0);
        }

        query += ` WHERE ` + conditions.join(" AND ");
    }
    query += ` LIMIT 10000 OFFSET 0`;
    console.log(query);
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

const UpdateIngredientService = (ingredient: {
    name: string;
    stock: number;
    is_available: boolean;
    unit: string;
    ingredient_id: number;
}) => {
    const { name, stock, is_available, unit } = ingredient;
    const query = `UPDATE ingredients SET name ="${name}",stock=${stock},is_available = ${is_available},unit = "${unit}"  WHERE ingredient_id = "${ingredient.ingredient_id}"`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

export {
    GetIngredientService,
    AddIngredientService,
    GetIngredientByIdService,
    GetIngredientByParamsService,
    GetSumIngredientByParamsService,
    DeleteIngredientService,
    UpdateIngredientService,
};
