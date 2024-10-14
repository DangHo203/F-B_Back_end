
export class ShipperService {
    private shippersStatus: Record<string, string> = {};
    private listShipper = new Set<number>();
    private shipperPosition: Record<string, any> = {};

    addShipper(shipperId: number) {
        this.shippersStatus[shipperId] = "available";
        this.listShipper.add(shipperId);
    }

    removeShipper(shipperId: number) {
        this.listShipper.delete(shipperId);
    }


    addShipperPosition(shipperId: number, position: any) {
        this.shipperPosition[shipperId] = position;
    }
    
    getShipperPosition(shipperId: number) {
        return this.shipperPosition[shipperId];
    }

    getShipperStatus() {
        return this.shippersStatus;
    }

    getListShipper() {
        return Array.from(this.listShipper);
    }
}
