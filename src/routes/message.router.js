import messageController from "../dao/message.controller.js";
import express from "express";
const router = express.Router();
router.get("/", async (req, res) => {
  res.json(await messageController.getMessages(req.query.limit));
});
router.post("/", async (req, res) => {
  res.json(await messageController.addMessage(req.body));
});
export default router;
