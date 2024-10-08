import { Router } from "express";
const router = Router();

import {
    AddOrderAPI,
    GetOrderByCustomerIdAPI,
    GetSumOrderAPI,
    GetOrderByParamsAPI,
    GetOrderItemsAPI,
    ChangeStatusAPI,
    CancelOrderAPI
}
from "./orderController";

router.get("/sum", GetSumOrderAPI)
router.get("/", GetOrderByParamsAPI)
router.get("/id", GetOrderByCustomerIdAPI)

router.get("/items", GetOrderItemsAPI)
router.put("/status", ChangeStatusAPI)
router.put("/cancel", CancelOrderAPI)

export default router;