import express from "express";
const app = express();
const port = 5000;
// const initRoutes = require("./route");
const initRoutes = require("./route.ts");
app.use(express.json());
require("dotenv").config();
const cors = require("cors");

app.use(
    cors({
        origin: ["http://localhost:3000","http://localhost:5173", "http://localhost:3001"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);


initRoutes(app);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
