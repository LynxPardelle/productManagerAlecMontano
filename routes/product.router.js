const productManager = require("../controllers/productManager");
const router = require("express").Router();
router.get("/", async (req, res) => {
  res.json(await productManager.getProducts(req.query.limit));
});
router.get("/:pid", async (req, res) => {
  res.json(await productManager.getProductById(req.params.pid));
});
router.post("/", async (req, res) => {
  res.json(await productManager.addProduct(req.body));
});
router.put("/:id", async (req, res) => {
  res.json(await productManager.updateProduct(req.params.id, req.body));
});
router.delete("/:id", async (req, res) => {
  res.json(await productManager.deleteProduct(req.params.id));
});
module.exports = router;
