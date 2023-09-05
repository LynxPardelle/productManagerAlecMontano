import { productController } from "../dao/product.controller.js";
import express from "express";
const router = express.Router();
router.get("/", async (req, res) => {
  res.json(await productController.getProducts(req.query.limit));
});
router.get("/:pid", async (req, res) => {
  res.json(await productController.getProductById(req.params.pid));
});
router.post("/", async (req, res) => {
  res.json(await productController.addProduct(req.body));
});
router.put("/:id", async (req, res) => {
  res.json(await productController.updateProduct(req.params.id, req.body));
});
router.delete("/:id", async (req, res) => {
  res.json(await productController.deleteProduct(req.params.id));
});
export default router;
