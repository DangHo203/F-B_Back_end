import { Socket, Server as SocketIOServer } from "socket.io";
import { ShipperService } from "../services/shipper.service";

const shipperService = new ShipperService();

export const handleDisconnection = (io: SocketIOServer, socket: Socket) => {
    socket.on("disconnectCustom", (id: number) => {
        console.log(`Shipper ${id} disconnected`);
        shipperService.removeShipper(id);
        io.emit("listShipper", { list: shipperService.getListShipper() });
    });
};
