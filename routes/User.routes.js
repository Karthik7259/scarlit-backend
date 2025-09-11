import { Router } from "express";
import { login, signup } from "../controller/User.controller.js";
import { authenticate } from "../middleware/auth.js";









const userRouter = Router();


userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.get("/profile", authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});



export default userRouter;