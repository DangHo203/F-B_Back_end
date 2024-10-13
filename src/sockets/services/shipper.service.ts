
export class ShipperService {
    private shippersStatus: Record<string, string> = {};
    private listShipper = new Set<number>();

    addShipper(shipperId: number) {
        this.shippersStatus[shipperId] = "available";
        this.listShipper.add(shipperId);
    }

    removeShipper(shipperId: number) {
        this.listShipper.delete(shipperId);
    }

    getShipperStatus() {
        return this.shippersStatus;
    }

    getListShipper() {
        return Array.from(this.listShipper);
    }
}
