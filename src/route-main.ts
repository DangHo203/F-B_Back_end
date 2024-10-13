import userRouter from "./components/User/userRoutes";
import staffRouter from "./components/Staff/staffRoutes";
import menuRouter from "./components/Menu/menuRoutes";
import ingredientRouter from "./components/Ingredient/ingredientRoutes";
import nutriRouter from "./components/Nutrition/nutriRoutes";
import orderRouter from "./components/Order/orderRoutes";
import notificationRouter from "./components/Notification/notificationRoutes";
import shiftRouter from "./components/Shift/shiftRoutes";
const initRoutes = (app: any) => {
    app.use("/api/user", userRouter);
    app.use("/api/staff", staffRouter);
    app.use("/api/menu", menuRouter);
    app.use("/api/ingredient", ingredientRouter);
    app.use("/api/nutrition", nutriRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/notification", notificationRouter);
    app.use("/api/shift", shiftRouter);
};

module.exports = initRoutes;
