import cartController from "../dao/cart.controller.js";
import express from "express";
const router = express.Router();
/* Create */
router.post("/", async (req, res) => {
  res.json(await cartController.addCart(req.body));
});
router.post("/:cid/product/:pid", async (req, res) => {
  res.json(
    await cartController.addProductToCart(req.params.cid, req.params.pid)
  );
});
/* Read */
router.get("/:cid", async (req, res) => {
  res.json(await cartController.getCartById(req.params.cid));
});
/* Update */
router.put("/:cid", async (req, res) => {
  res.json(await cartController.updateCart(req.params.cid, req.body));
});
router.put("/:cid/product/:pid", async (req, res) => {
  res.json(
    await cartController.updateProductFromCart(
      req.params.cid,
      req.params.pid,
      req.body
    )
  );
});
/* Delete */
router.delete("/:cid/product/:pid", async (req, res) => {
  res.json(
    await cartController.deleteProductFromCart(req.params.cid, req.params.pid)
  );
});
export default router;
