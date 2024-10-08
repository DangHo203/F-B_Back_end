export interface IOrder {
    order_id: number;
    customer_id: number;
    create_at: string;
    status: string;
    totalPrice: number;  
}

export interface IOrderItem {
    order_id: number;
    item_id: number;
    quantity: number;
    price: number;
    title:string;
    image:string;
}