/* Create express server */
const express = require("express");
const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* Routes */
const product_routes = require("./routes/product.router");
const cart_routes = require("./routes/cart.router");
app.use("/", express.static(__dirname + "public"));
app.use("/api/products", product_routes);
app.use("/api/carts", cart_routes);
// Ruta o método de prueba para el API
app.get("/datos-autor", (req, res) => {
  console.log("Hola mundo");
  return res.status(200).send({
    autor: "Lynx Pardelle",
    url: "https://www.lynxpardelle.com",
  });
});
