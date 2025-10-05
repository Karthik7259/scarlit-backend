import { Router } from "express";
import {  createOrder,getAllOrders,updateOrder, updatestatus } from "../controller/Order.controller.js";
import auth from "../middleware/auth.js"
const OrderRouter = Router();


OrderRouter.post("/create", createOrder);
OrderRouter.get("/all", getAllOrders);
OrderRouter.put("/update", updateOrder);
OrderRouter.patch("/updatestatus", auth, updatestatus);




export default OrderRouter;
