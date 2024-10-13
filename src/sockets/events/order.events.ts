import { Socket, Server as SocketIOServer } from "socket.io";

export const registerOrderEvents = (io: SocketIOServer, socket: Socket) => {
    socket.on("orderArrive", (id: string) => {
        io.emit("orderOnArrive", id);
    });

    socket.on("orderDelivered", (id: string) => {
        io.emit("orderDelivered", id);
    });
};
