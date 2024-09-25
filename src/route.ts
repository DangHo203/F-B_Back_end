import userRouter from "./Components/User/userRoutes";
import staffRouter from "./Components/Staff/staffRoutes";
const initRoutes = (app: any) => {
    app.use("/api/user", userRouter);
    app.use("/api/staff", staffRouter);
};

module.exports = initRoutes;
