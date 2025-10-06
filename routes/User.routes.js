import { Router } from "express";
import { deleteUserByEmail, getAllUsers, login, signup } from "../controller/User.controller.js";
import { authenticate } from "../middleware/auth.js";









const userRouter = Router();


userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/all",getAllUsers);
userRouter.delete("/delete/email",deleteUserByEmail);

userRouter.get("/profile", authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});



export default userRouter;