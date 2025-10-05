import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },

    productName: { type: String, required: true, trim: true },
    productBrand: { type: String, trim: true },
    selectedSize: { type: String, trim: true },
    selectedColour: { type: String, trim: true },
    
    orderId: { type: String, required: true, unique: true },
    address: { type: String, required: true, trim: true },
    comments: { type: String, trim: true },

    // Dynamic status - can be any string
    status: { 
      type: String, 
      required: true,
      default: "pending",
      trim: true
    },

    // Full history of status changes
    history: [
      {
        status: { 
          type: String, 
          required: true,
          trim: true 
        },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        changedByEmail: { type: String },
        changedAt: { type: Date, default: Date.now },
        notes: { type: String, trim: true }
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;


