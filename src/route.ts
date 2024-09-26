import userRouter from "./Components/User/userRoutes";
import staffRouter from "./Components/Staff/staffRoutes";
import menuRouter from "./Components/Menu/menuRoutes";
import ingredientRouter from "./Components/Ingredient/ingredientRoutes";
import nutriRouter from "./Components/Nutrition/nutriRoutes";
const initRoutes = (app: any) => {
    app.use("/api/user", userRouter);
    app.use("/api/staff", staffRouter);
    app.use("/api/menu", menuRouter);
    app.use("/api/ingredient", ingredientRouter);
    app.use("/api/nutrition", nutriRouter);
};

module.exports = initRoutes;
