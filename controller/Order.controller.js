import { v4 as uuidv4 } from "uuid";
import Order from "../model/Order.model.js";



function generateOrderId() {
  // Example: ORD-20250911-12345
  const date = new Date();
  const ymd = date.toISOString().slice(0,10).replace(/-/g,""); // YYYYMMDD
  const rand = Math.floor(10000 + Math.random() * 90000); // 5-digit random
  return `ORD-${ymd}-${rand}`;
}

export const createOrder = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      productType,
      brand,
      size,
      colour,
      address,
      comments
    } = req.body;

    // Generate a concise orderId
    const orderId = generateOrderId();

    // Create new order
    const order = new Order({
      name,
      email,
      phone,
      productType,
      brand,
      size,
      colour,
      address,
      comments,
      orderId
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order saved successfully!",
      data: order,
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save order",
      error: error.message,
    });
  }
};



export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};


export const updatestatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const employeeId = req.user._id;
    const employeeEmail = req.user.email;

    // Find the order by custom orderId
    const order = await Order.findOne({ orderId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update current status
    order.status = status;

    // If history exists, update the last entry; else, push a new entry
    if (order.history && order.history.length > 0) {
      const lastIndex = order.history.length - 1;
      order.history[lastIndex].status = status;
      order.history[lastIndex].changedBy = employeeId;
      order.history[lastIndex].changedByEmail = employeeEmail;
      order.history[lastIndex].changedAt = new Date();
    } else {
      order.history.push({
        status,
        changedBy: employeeId,
        changedByEmail: employeeEmail,
        changedAt: new Date(),
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};



export const updateOrder = async (req, res) => {
  try {
    const { email, _id, ...updateData } = req.body; // Exclude _id

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to update an order",
      });
    }

    const order = await Order.findOneAndUpdate(
      { email },          // filter by email
      { $set: updateData }, 
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this email",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order",
    });
  }
};


