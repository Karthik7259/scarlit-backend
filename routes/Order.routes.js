import { Router } from "express";
import { createOrder,getAllOrders } from "../controller/Order.controller.js";
const OrderRouter = Router();


OrderRouter.post("/create", createOrder);
OrderRouter.get("/all", getAllOrders);

export default OrderRouter;
