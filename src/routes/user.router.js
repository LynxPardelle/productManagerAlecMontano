import express from "express";
import { UserController } from "../dao/user.controller.js";
const router = express.Router();
router.post("/register", UserController.registerUser);
router.post("/login", UserController.login);
router.get("/user/:id", UserController.getUser);

export default router;
