import MessageDTO from "./../dao/DTOs/message.DTO.js";

export default class MessageRepository {
  constructor(dao) {
    this.dao = dao;
  }
  /* Create */
  async addMessage(message) {
    try {
      const newMessage = new MessageDTO(message);
      return await this.dao.addMessage(newMessage);
    } catch (error) {
      return { error: error.message };
    }
  }
  /* Read */
  async getMessages(limit = 0) {
    try {
      return await this.dao.getMessages(limit);
    } catch (error) {
      return { error: error.message };
    }
  }
}
