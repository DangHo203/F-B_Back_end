import db from "../../config/database.config";

const AddIngredientToMenuService = (ingredient: {
    item_id: number;
    ingredient_id: number;
    quantity_required: number;
}) => {
    const query = `INSERT INTO menuitemingredients SET ?`;

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

const RemoveIngredientFromMenuService = (ingredient: {
    menu_item_ingredient_id: number;
}) => {
    const query = `DELETE FROM menuitemingredients WHERE menu_item_ingredient_id = ?`;
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

const UpdateIngredientFromMenuService = (ingredient: {
    menu_item_ingredient_id: number;
    quantity_required: number;
}) => {
    const query = `UPDATE menuitemingredients SET quantity_required = ? WHERE menu_item_ingredient_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(
            query,
            [ingredient.quantity_required, ingredient.menu_item_ingredient_id],
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

const GetIngredientFromMenuService = (ingredient: { item_id: number }) => {
    const query = `SELECT menuitemingredients.ingredient_id,menuitemingredients.item_id, menuitemingredients.quantity_required, ingredients.name  FROM menuitemingredients join ingredients on menuitemingredients.ingredient_id = ingredients.ingredient_id WHERE menuitemingredients.item_id = ?

`;
    return new Promise((resolve, reject) => {
        db.query(query, ingredient.item_id, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
const DeleteAllIngredientsFromMenuService = (ingredient: { item_id: number }) => {
    const query = `DELETE FROM menuitemingredients WHERE item_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, ingredient.item_id, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export {
    AddIngredientToMenuService,
    RemoveIngredientFromMenuService,
    UpdateIngredientFromMenuService,
    GetIngredientFromMenuService,
    DeleteAllIngredientsFromMenuService
};
