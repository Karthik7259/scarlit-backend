import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g., "Hoodie"
    brand: { type: String, trim: true },                // e.g., "Adidas"
    sizes: [{ type: String }],                          // e.g., ["S", "M", "L", "XL"]
    colours: [{ type: String }],                        // e.g., ["Black", "White"]
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;


