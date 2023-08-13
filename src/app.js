/* Create express server */
import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";
/* Run server */
const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
/* Socket.io */
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("cliente conectado");
  socket.on("disconnect", () => {
    console.log("cliente desconectado");
  });
  socket.on("message", (data) => {
    console.log(data);
    io.sockets.emit("message", data);
  });
  socket.emit("message", "Bienvenido al chat");
  socket.broadcast.emit(
    "evento_para_todos_menos_el_socket_actual",
    "Un usuario se ha conectado"
  );
  io.emit("evento_para_todos", "Bienvenido al chat");
  /* Products */
  socket.on("get-products", async (option) => {
    try {
      let products = {
        status: "error",
        message:
          "No se encontraron productos, por que no se dió una opción válida.",
      };
      switch (true) {
        case option === "all":
          let productsFromServer = await fetch(
            "http://localhost:8080/api/products/"
          );
          if (productsFromServer.status === 200) {
            products = await productsFromServer.json();
          } else {
            console.log(productsFromServer);
            throw new Error("No se pudo obtener los productos.");
          }
          break;
        default:
          break;
      }
      io.sockets.emit("send-products", products);
    } catch (error) {
      io.sockets.emit("error", {
        status: "error",
        message:
          "hubo un error en el servidor al intentar obtener los productos.",
        error,
      });
    }
  });
});
/* Template Engine */
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);
server.on("error", (error) => console.log(`Error en servidor ${error}`));
/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* Routes */
import product_routes from "./routes/product.router.js";
import cart_routes from "./routes/cart.router.js";
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