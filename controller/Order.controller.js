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





