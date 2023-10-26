import express from "express";
import {
  addCart,
  addProductToCart,
  deleteProductFromCart,
  getCartById,
  purchaseCart,
  updateCart,
  updateProductFromCart,
} from "../controllers/cart.controller.js";
import { auth } from "../middleware/auth.middleware.js";
const router = express.Router();
/* Create */
router.post("/", auth, addCart);
router.post("/:cid/product/:pid", auth, addProductToCart);
/* Read */
router.get("/:cid", getCartById);
/* Update */
router.put("/:cid", auth, updateCart);
router.put("/:cid/product/:pid", auth, updateProductFromCart);
router.put("/:cid/purchase", auth, purchaseCart);
/* Delete */
router.delete("/:cid/product/:pid", auth, deleteProductFromCart);
export default router;
