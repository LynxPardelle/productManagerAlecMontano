import express from "express";
import {
  getUser,
  login,
  registerUser,
} from "../controllers/user.controller.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", login);
router.get("/user/:id", getUser);

export default router;
