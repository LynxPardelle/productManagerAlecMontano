import cartController from "../dao/cart.controller.js";
import express from "express";
const router = express.Router();
router.get("/", async (req, res) => {
  res.json(await cartController.getCarts(req.query.limit));
});
router.get("/:cid", async (req, res) => {
  res.json(await cartController.getCartById(req.params.cid));
});
router.post("/", async (req, res) => {
  res.json(await cartController.addCart(req.body));
});
router.post("/:cid/product/:pid", async (req, res) => {
  res.json(
    await cartController.addProductToCart(req.params.cid, req.params.pid)
  );
});
export default router;
