import mongoose from "mongoose";

const STATUS_ENUM = ["pending", "processing", "completed", "cancelled"];

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },

    productName: { type: String, required: true, trim: true }, // Change from ObjectId to String
    productBrand: { type: String, trim: true }, // Store brand separately
    selectedSize: { type: String, trim: true },
    selectedColour: { type: String, trim: true },
    
    orderId: { type: String, required: true, unique: true },
    address: { type: String, required: true, trim: true },
    comments: { type: String, trim: true },

    // Current status
    status: { type: String, enum: STATUS_ENUM, default: "pending" },

    // Full history of status changes
    history: [
      {
        status: { type: String, enum: STATUS_ENUM },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        changedByEmail: { type: String },
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
