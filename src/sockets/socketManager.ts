import express, { Application } from "express";
import http, { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import cors from "cors";
import { initializeConnection } from "./events/connection";

export default class ShipperStatusManager {
    private app: Application;
    private server: HTTPServer;
    private io: SocketIOServer;

    constructor() {
        this.app = express();
        this.app.use(cors());
        this.server = http.createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
            },
        });
        this.initializeSocketEvents();
    }

    private initializeSocketEvents() {
        this.io.on("connection", (socket: Socket) => {
            console.log("A user connected:", socket.id);
            initializeConnection(this.io,socket);
        });
    }

    // Start the server
    public start(port: number) {
        this.server.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}
