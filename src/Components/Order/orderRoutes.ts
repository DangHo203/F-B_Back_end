import { Router } from "express";
const router = Router();

import {
    CreateOrderAPI,
    GetOrderByCustomerIdAPI,
    GetSumOrderAPI,
    GetOrderByParamsAPI,
    GetOrderItemsAPI,
    ChangeStatusAPI,
    CancelOrderAPI,
    GetShipperOrderAPI,
    AddOrderItemsAPI,
} from "./orderController";

router.get("/sum", GetSumOrderAPI);
router.get("/", GetOrderByParamsAPI);
router.get("/id", GetOrderByCustomerIdAPI);
router.get("/items", GetOrderItemsAPI);
router.put("/status", ChangeStatusAPI);
router.put("/cancel", CancelOrderAPI);
router.post("/", CreateOrderAPI);
router.post("/items", AddOrderItemsAPI);
router.get("/shipper", GetShipperOrderAPI);

export default router;
