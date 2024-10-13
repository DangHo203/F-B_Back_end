import { Socket, Server as SocketIOServer } from "socket.io";
import { ShipperService } from "../services/shipper.service";

const shipperService = new ShipperService();

export const registerShipperEvents = (io: SocketIOServer, socket: Socket) => {
    socket.on("joinShipper", (shipperId: number) => {
        console.log(`Shipper ${shipperId} joined`);
        shipperService.addShipper(shipperId);

        io.emit("listShipper", { list: shipperService.getListShipper() });
        io.emit("shipperStatusUpdate", { shipperId, status: "available" });
    });
   
    socket.on("getListShipper", () => {
        io.emit("listShipper", {
            list: Array.from(shipperService.getListShipper()),
        });
    });

    socket.on("getShipperStatus", () => {
        io.emit("listShipper", { list: shipperService.getShipperStatus() });
    });
    

    // Additional shipper-related events can be added here
};
