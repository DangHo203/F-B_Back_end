import { Socket, Server as SocketIOServer } from "socket.io";

import { handleDisconnection } from "./disconnection";
import { registerOrderEvents } from "./order.events";
import { registerShipperEvents } from "./shipper.events";

export const initializeConnection = (io: SocketIOServer, socket: Socket) => {
    console.log("A user connected:", socket.id);

    // Register shipper-related events
    registerShipperEvents(io, socket);

    // Register order-related events
    registerOrderEvents(io, socket);

    // Handle disconnection
    handleDisconnection(io, socket);
};
