import userRouter from "./user";

const initRoutes = (app : any) => {
    app.use("/api/user", userRouter);
 
};

module.exports = initRoutes;