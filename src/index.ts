import express from "express";
import ShipperStatusManager from "./sockets/socketManager";
const app = express();
const port = 5000;
// const initRoutes = require("./route");
const initRoutes = require("./route-main");

app.use(express.json());
require("dotenv").config();
const cors = require("cors");

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:3001",
            "http://myapp.local:3000",
            "http://myapp.local:8080"
        ],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

initRoutes(app);
const manager = new ShipperStatusManager();
manager.start(5001);    

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
