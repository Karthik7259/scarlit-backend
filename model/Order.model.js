

import mongoose from "mongoose";

const STATUS_ENUM = ["pending", "processing", "completed", "cancelled"];

const orderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },

    productType: {
      type: String,
      required: true,
      enum: [
        "With Zip Hoodie",
        "Without Zip Hoodie",
        "Polo-shirt",
        "Jacket",
        "Bonded Fleece",
        "Varsity Jacket",
        "Crop-Top",
        "Round Neck T-shirt",
        "Windcheater",
        "Nashville Jacket",
        "Asger Hoodie",
        "Sweatshirt",
        "Austin Hoodie",
        "Austin Jacket",
      ],
    },
        orderId: { type: String, required: true, unique: true },

    brand: {
      type: String,
      enum: [
        "Adidas",
        "Rare Rabbit",
        "UCB",
        "USPA",
        "M&S",
        "Stellar",
        "G4C",
        "Jack & Jones",
        "Scott",
        "Spinnex",
        "UG",
        "Xech",
        "Oblique",
      ],
    },

    size: { type: String, enum: ["XS", "Small", "Medium", "Large", "XL", "XXL", "3XL"] },
    colour: { type: String, enum: ["Black", "Navy Blue", "Maroon", "White", "Grey Melange", "Dark Grey", "Petrol"] },

    address: { type: String, required: true, trim: true },
    comments: { type: String, trim: true },

    // Current status
    status: { type: String, enum: STATUS_ENUM, default: "pending" },

    // Full history of status changes
    history: [
      {
        status: { type: String, enum: STATUS_ENUM },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
        changedByEmail: { type: String }, // optional quick lookup
        changedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
