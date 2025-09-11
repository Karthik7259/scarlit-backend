import Employee from "../model/Employee.model.js";
import jwt from "jsonwebtoken";

// Signup route
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if user exists
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }
    const employee = new Employee({ name, email, password });
    await employee.save();
    res.status(201).json({ success: true, message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};

// Login route
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    // Generate JWT
    const token = jwt.sign(
      { id: employee._id, email: employee.email },
      "Scarlit", // Use env variable in production
      { expiresIn: "1d" }
    );
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login failed" });
  }
};