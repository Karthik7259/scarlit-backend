import Order from "../model/Order.model.js"



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
      comments,
    } = req.body;

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


