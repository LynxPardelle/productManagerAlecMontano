import { Carts } from "../dao/factory.js";
import CartRepository from "./cart.repository.js";
import Messages from "../dao/mongo/messageMongo.dao.js";
import MessageRepository from "./message.repository.js";
import { Products } from "../dao/factory.js";
import ProductRepository from "./product.repository.js";
import Users from "../dao/mongo/userMongo.dao.js";
import UserRepository from "./user.repository.js";

export const _cartService = new CartRepository(Carts);
export const _messageService = new MessageRepository(Messages);
export const _productService = new ProductRepository(Products);
export const _userService = new UserRepository(Users);
