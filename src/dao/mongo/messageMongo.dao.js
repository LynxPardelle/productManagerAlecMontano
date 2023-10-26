import Message from "./models/message.model.js";
export default {
  /* Create */
  async addMessage(message) {
    try {
      console.log(message);
      if (!message.user || !message.message || !message.date)
        throw new Error("Missing data");
      let newMessage = {
        user: message.user,
        message: message.message,
        date: message.date,
      };
      let BDmessage = await Message.create(newMessage);
      if (!BDmessage) {
        throw new Error("Error adding message to BD");
      }
      return {
        status: "success",
        message: "Message added successfully",
        data: BDmessage,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error adding message",
        error: error.message,
      };
    }
  },
  /* Read */
  async getMessages(limit = 0) {
    try {
      let messages = await Message.find();
      if (!messages) throw new Error("Error getting messages");
      if (messages.length === 0) throw new Error("No messages found");
      return {
        status: "success",
        message: "Messages listed successfully",
        data: limit !== 0 ? messages.slice(0, limit) : messages,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error listing messages",
        error: error.message,
      };
    }
  },
};
