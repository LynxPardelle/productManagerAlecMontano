import { _messageService } from "../repositories/index.repository.js";

/* Create */
export const addMessage = async (req, res) => {
  try {
    const message = await _messageService.addMessage(req.body);
    if (!message?.data)
      return res.status(400).send({
        status: "error",
        message: "Error creating message",
        error: message?.error || message,
      });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error creating message",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
/* Read */
export const getMessages = async (req, res) => {
  try {
    const messages = await _messageService.getMessages(req.query.limit);
    if (!messages?.data)
      return res.status(404).send({
        status: "error",
        message: "Messages not found",
        error: messages?.error || messages,
      });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Error retrieving messages",
      error: error.message.replace(/"/g, "'"),
    });
  }
};
