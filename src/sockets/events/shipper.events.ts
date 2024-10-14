import { Socket, Server as SocketIOServer } from "socket.io";
import { ShipperService } from "../services/shipper.service";

const shipperService = new ShipperService();

export const registerShipperEvents = (io: SocketIOServer, socket: Socket) => {
    socket.on("joinShipper", (shipperId: number) => {
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

    socket.on("Shipper-Position-Post", (data) => {
        shipperService.addShipperPosition(data.id, data.shipperLocation);
        io.emit("Shipper-Position-Get", {
            id: data.id,
            shipperLocation: shipperService.getShipperPosition(data.id) || null,
        });
    });

    // socket.on("Shipper-Position-Get-Init", (id: number) => {
    //     io.emit("Shipper-Position-Get-Init-Data", {
    //         id: id,
    //         shipperLocation: shipperService.getShipperPosition(id) || null,
    //     });
    // });

    socket.on("disconnectCustom", (id: number) => {
        console.log(`Shipper ${id} disconnected`);
        shipperService.removeShipper(id);
        io.emit("listShipper", { list: shipperService.getListShipper() });
    });
    // Additional shipper-related events can be added here
};
