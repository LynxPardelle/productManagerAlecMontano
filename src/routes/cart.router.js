import cartManager from "../controllers/cartManager.js";
import express from "express";
const router = express.Router();
router.get("/", async (req, res) => {
  res.json(await cartManager.getCarts(req.query.limit));
});
router.get("/:cid", async (req, res) => {
  res.json(await cartManager.getCartById(req.params.cid));
});
router.post("/", async (req, res) => {
  res.json(await cartManager.addCart(req.body));
});
router.post("/:cid/product/:pid", async (req, res) => {
  res.json(await cartManager.addProductToCart(req.params.cid, req.params.pid));
});
export default router;
