import db from "../../config/database.config";

const AddNutritionService = (nutrition: {
    item_id: number;
    calories: number;
    carbs: number;
    proteins: number;
    fats: number;
})=>{
    const { item_id, calories, carbs, proteins, fats } = nutrition;
    const query = `INSERT INTO nutritionalinfo (item_id, calories, carbs, proteins, fats) VALUES (?, ?, ?, ?, ?)`;

    return new Promise((resolve, reject) => {
        db.query(query, [item_id, calories, carbs, proteins, fats], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

}

const UpdateNutritionService = (nutrition: {
    nutritional_info_id: number;
    calories: number;
    carbs: number;
    proteins: number;
    fats: number;

})=>{
    const { nutritional_info_id, calories, carbs, proteins, fats } = nutrition;
    const query = `UPDATE nutritionalinfo SET calories=?, carbs=?, proteins=?, fats=? WHERE nutritional_info_id=?`;

    return new Promise((resolve, reject) => {
        db.query(query, [ calories, carbs, proteins, fats, nutritional_info_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

}

const GetNutritionService = (item_id: number)=>{
    const query = `SELECT * FROM nutritionalinfo WHERE item_id=?`;

    return new Promise((resolve, reject) => {
        db.query(query, [item_id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export {
    AddNutritionService,
    UpdateNutritionService,
    GetNutritionService
}