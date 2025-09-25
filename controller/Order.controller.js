import dotenv from "dotenv";
dotenv.config(); 
import Order from "../model/Order.model.js";
import Product from "../model/Product.model.js"; // Add this import
import sendEmail from "../Service/sendEmail.js";
import OrderCreateEmailTemplate from "../utils/OrderCreateEmailTemplate.js";





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
      product, // This will still be the ObjectId for validation
      selectedSize,
      selectedColour,
      address,
      comments
    } = req.body;

    // Find product to validate and get details
    const productDoc = await Product.findById(product);
    if (!productDoc) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Validate selected size is available
    if (selectedSize && !productDoc.sizes.includes(selectedSize)) {
      return res.status(400).json({
        success: false,
        message: `Size "${selectedSize}" is not available for this product. Available sizes: ${productDoc.sizes.join(', ')}`
      });
    }

    // Validate selected color is available
    if (selectedColour && !productDoc.colours.includes(selectedColour)) {
      return res.status(400).json({
        success: false,
        message: `Color "${selectedColour}" is not available for this product. Available colors: ${productDoc.colours.join(', ')}`
      });
    }

    // Generate orderId
    const orderId = generateOrderId();

    // Create new order with product name instead of ObjectId
    const order = new Order({
      name,
      email,
      phone,
      productName: productDoc.name,     // Store product name
      productBrand: productDoc.brand,   // Store product brand
      selectedSize,
      selectedColour,
      orderId,
      address,
      comments
    });

    await order.save();

    // Prepare email HTML using the template
    const emailHtml = OrderCreateEmailTemplate({
      name,
      email,
      phone,
      productType: productDoc.name,
      brand: productDoc.brand,
      size: selectedSize || 'N/A',
      colour: selectedColour || 'N/A',
      address,
      orderId,
      orderDate: new Date().toLocaleDateString()
    });

    // Send confirmation email
    try {
      await sendEmail({
        sendTo: email,
        subject: `Order Confirmation - ${orderId}`,
        html: emailHtml
      });
      console.log(`Confirmation email sent to ${email}`);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Order created successfully and confirmation email sent!",
      data: order
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
   

    // Validate required fields
    if (!orderId || !status) {
      return res.status(400).json({ 
        success: false, 
        message: "OrderId and status are required" 
      });
    }

    // Validate status
    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
      });
    }

    

    // Check authentication
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const employeeId = req.user._id;
    const employeeEmail = req.user.email;
    console.log("Employee ID:", employeeId, "Email:", employeeEmail);

    // Find the order by custom orderId
    const order = await Order.findOne({ orderId });
    console.log("Found order:", order);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    // Check if status is actually changing
    if (order.status === status) {
      return res.status(400).json({
        success: false,
        message: `Order is already in ${status} status`
      });
    }

    // Update current status
    order.status = status;

    // Always add a NEW history entry (don't update existing ones)
    order.history.push({
      status,
      changedBy: employeeId,
      changedByEmail: employeeEmail,
      changedAt: new Date(),
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });

  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update order status",
      error: err.message 
    });
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

    // Find the existing order first
    const existingOrder = await Order.findOne({ email });
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this email",
      });
    }

    // Define allowed fields to update (security measure)
    const allowedFields = ['name', 'phone', 'address', 'comments', 'selectedSize', 'selectedColour', 'status'];
    const filteredUpdateData = {};
    
    // Only allow updating specific fields
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field];
      }
    }

    // Validate status if being updated
    if (filteredUpdateData.status) {
      const validStatuses = ["pending", "processing", "completed", "cancelled"];
      if (!validStatuses.includes(filteredUpdateData.status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
        });
      }
    }

    // If size or color is being updated, validate against the product
    if (filteredUpdateData.selectedSize || filteredUpdateData.selectedColour) {
      // Find the product using productName (since we store name, not ObjectId)
      const productDoc = await Product.findOne({ name: existingOrder.productName });
      
      if (!productDoc) {
        return res.status(400).json({
          success: false,
          message: "Product not found for validation"
        });
      }

      // Validate size if being updated
      if (filteredUpdateData.selectedSize && !productDoc.sizes.includes(filteredUpdateData.selectedSize)) {
        return res.status(400).json({
          success: false,
          message: `Size "${filteredUpdateData.selectedSize}" is not available for this product. Available sizes: ${productDoc.sizes.join(', ')}`
        });
      }

      // Validate color if being updated
      if (filteredUpdateData.selectedColour && !productDoc.colours.includes(filteredUpdateData.selectedColour)) {
        return res.status(400).json({
          success: false,
          message: `Color "${filteredUpdateData.selectedColour}" is not available for this product. Available colors: ${productDoc.colours.join(', ')}`
        });
      }
    }

    // Update the order with validated data
    const order = await Order.findOneAndUpdate(
      { email },
      { $set: filteredUpdateData },
      { new: true, runValidators: true }
    );

    // If status was updated, add to history
    if (filteredUpdateData.status) {
      order.history.push({
        status: filteredUpdateData.status,
        changedBy: null, // No user context in this endpoint
        changedByEmail: "system", // Mark as system update
        changedAt: new Date(),
      });
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });

  } catch (error) {
    console.error("Error updating order:", error);
    
    // Handle specific MongoDB validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        details: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message
    });
  }
};



