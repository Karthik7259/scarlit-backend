import jwt from "jsonwebtoken";
import Employee from "../model/Employee.model.js";

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "Scarlit"); // Use env variable in production
    req.user = await Employee.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};


export default authenticate;