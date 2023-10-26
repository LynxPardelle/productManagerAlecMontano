import UserDTO from "./../dao/DTOs/user.DTO.js";

export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  /* Create */
  async registerUser(user) {
    try {
      const newUser = new UserDTO(user);
      return await this.dao.registerUser(newUser);
    } catch (error) {
      return { error: error.message };
    }
  }
  /* Read */
  async getUser(id) {
    try {
      return await this.dao.getUser(id);
    } catch (error) {
      return { error: error.message };
    }
  }
  async login(email, password) {
    try {
      return await this.dao.login(email, password);
    } catch (error) {
      return { error: error.message };
    }
  }
}
