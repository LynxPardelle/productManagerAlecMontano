/* Create express server */
const express = require("express");
const app = express();
const router = express.Router();
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
const ProductManager = require("./productManager");
const productManager = new ProductManager("./data/");
/* Create 10 products for testing */
setTimeout(() => {
  (async () => {
    let products = await productManager.getProducts();
    if (!products || !products.data || products.data.length < 10) {
      for (let i = 0; i < 10; i++) {
        productManager.addProduct({
          title: `Product ${i}`,
          description: `Description ${i}`,
          price: Math.floor(Math.random() * 1000),
          thumbnail: `Thumbnail ${i}`,
          code: `Code ${i}`,
          stock: Math.floor(Math.random() * 100),
        });
      }
    }
  })();
}, 1000);
/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api", router);
/* Router */
router.get("/products", async (req, res) => {
  res.json(await productManager.getProducts(req.query.limit));
});
router.get("/products/:pid", async (req, res) => {
  res.json(await productManager.getProductById(req.params.pid));
});
router.post("/products", async (req, res) => {
  res.json(await productManager.addProduct(req.body));
});
router.put("/products/:id", async (req, res) => {
  res.json(await productManager.updateProduct(req.params.id, req.body));
});
router.delete("/products/:id", async (req, res) => {
  res.json(await productManager.deleteProduct(req.params.id));
});
