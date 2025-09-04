import { Router } from "express";
import { createOrder,getAllOrders,updateOrder } from "../controller/Order.controller.js";
const OrderRouter = Router();


OrderRouter.post("/create", createOrder);
OrderRouter.get("/all", getAllOrders);
OrderRouter.put("/update", updateOrder);

export default OrderRouter;
