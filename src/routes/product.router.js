import express from "express";
import {
  addProduct,
  deleteProduct,
  getMockedProducts,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import { authPremium } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/", getProducts);
router.get("/mockingproducts", getMockedProducts);
router.get("/:pid", getProductById);
router.post("/", authPremium, addProduct);
router.put("/:id", authPremium, updateProduct);
router.delete("/:id", authPremium, deleteProduct);
export default router;
