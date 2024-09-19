import userRouter from "./user";
import staffRouter from "./staff";
const initRoutes = (app: any) => {
    app.use("/api/user", userRouter);
    app.use("/api/staff", staffRouter);
};

module.exports = initRoutes;
