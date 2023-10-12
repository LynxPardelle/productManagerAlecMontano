/* Create express server */
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./dirname.js";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import passport from "passport";
import initializePassport from "./config/passport-config.js";
import MongoSingleton, { mongoUrl } from "./config/mongoSingleton.js";
import { options } from "./config/process.js";
import cors from "cors";
/* Run server */
const app = express();
const PORT = options.port || 8080;
MongoSingleton.getInstance();
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
initializePassport();
/* Session */
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: mongoUrl,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 15,
    }),
    /* TODO: Add secret with dot env */
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
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
        case option.includes("filter:"):
          let productsFromServerFiltered = await fetch(
            "http://localhost:8080/api/products/" +
              option.replace("filter:", "")
          );
          if (productsFromServerFiltered.status === 200) {
            products = await productsFromServerFiltered.json();
          } else {
            console.log(productsFromServerFiltered);
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
  /* Chat */
  socket.on("user-join", (data) => {
    socket.broadcast.emit("send-message", {
      data: {
        date: data.date,
        message: data.user + " ha entrado al chat.",
        user: "System",
      },
      message: "Message added successfully",
      status: "success",
    });
  });
  socket.on("new-message", async (data) => {
    try {
      let message = {
        status: "error",
        message: "No se pudo enviar el mensaje.",
      };
      let messageFromServer = await fetch(
        "http://localhost:8080/api/messages/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (messageFromServer.status === 200) {
        message = await messageFromServer.json();
      } else {
        console.log(messageFromServer);
        throw new Error("No se pudo enviar el mensaje.");
      }
      io.sockets.emit("send-message", message);
    } catch (error) {
      io.sockets.emit("error", {
        status: "error",
        message: "hubo un error en el servidor al intentar enviar el mensaje.",
        error,
      });
    }
  });
  socket.on("get-messages", async (limit) => {
    try {
      let messages = {
        status: "error",
        message: "No se encontraron mensajes.",
      };
      let messagesFromServer = await fetch(
        `http://localhost:8080/api/messages/?limit=${limit}`
      );
      if (messagesFromServer.status === 200) {
        messages = await messagesFromServer.json();
      } else {
        console.log(messagesFromServer);
        throw new Error("No se pudo obtener los mensajes.");
      }
      io.sockets.emit("send-messages", messages);
    } catch (error) {
      io.sockets.emit("error", {
        status: "error",
        message:
          "hubo un error en el servidor al intentar obtener los mensajes.",
        error,
      });
    }
  });
  socket.on("error", (error) => {
    console.log(error);
  });
  socket.on("disconnect", () => {
    console.log("cliente desconectado");
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
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Routes */
import product_routes from "./routes/product.router.js";
import cart_routes from "./routes/cart.router.js";
import message_routes from "./routes/message.router.js";
import session_routes from "./routes/session.router.js";
import user_routes from "./routes/user.router.js";
app.use("/api/products", product_routes);
app.use("/api/carts", cart_routes);
app.use("/api/messages", message_routes);
app.use("/api/sessions", session_routes);
app.use("/api/users", user_routes);
// Ruta o método de prueba para el API
app.get("/datos-autor", (req, res) => {
  console.log("Hola mundo");
  return res.status(200).send({
    autor: "Lynx Pardelle",
    url: "https://www.lynxpardelle.com",
  });
});
