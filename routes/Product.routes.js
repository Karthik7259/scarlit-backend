import { Router } from "express";
import { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from "../controller/Product.controller.js";


const ProductRouter = Router();

// Public routes
ProductRouter.get("/all", getAllProducts);
ProductRouter.get("/:id", getProductById);

// Admin routes (protected)
ProductRouter.post("/create",createProduct);
ProductRouter.put("/update/:id",updateProduct);
ProductRouter.delete("/delete/:id",deleteProduct);

export default ProductRouter;