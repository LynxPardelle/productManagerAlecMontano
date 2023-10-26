import { addMessage, getMessages } from "../controllers/message.controller.js";
import express from "express";
import { auth } from "../middleware/auth.middleware.js";
const router = express.Router();
router.get("/", getMessages);
router.post("/", auth, addMessage);
export default router;
