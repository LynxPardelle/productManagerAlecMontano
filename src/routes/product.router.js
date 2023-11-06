import express from "express";
import {
  addProduct,
  deleteProduct,
  getMockedProducts,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { authAdmin } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/", getProducts);
router.get("/mockingproducts’", getMockedProducts);
router.get("/:pid", getProductById);
router.post("/", authAdmin, addProduct);
router.put("/:id", authAdmin, updateProduct);
router.delete("/:id", authAdmin, deleteProduct);
export default router;
