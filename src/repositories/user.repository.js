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
  async getUsers() {
    try {
      return await this.dao.getUsers();
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
  /* Delete */
  async deleteInactiveUsers() {
    try {
      return await this.dao.deleteInactiveUsers();
    } catch (error) {
      return { error: error.message };
    }
  }
  async deleteUser(id) {
    try {
      return await this.dao.deleteUser(id);
    } catch (error) {
      return { error: error.message };
    }
  }
  async logout(session) {
    try {
      return await this.dao.logout(session);
    } catch (error) {
      return { error: error.message };
    }
  }
  /* Recovery */
  async recoveryPassword(email) {
    try {
      return await this.dao.recoveryPassword(email);
    } catch (error) {
      return { error: error.message };
    }
  }
  async resetPassword(token, password, email) {
    try {
      return await this.dao.resetPassword(token, password, email);
    } catch (error) {
      return { error: error.message };
    }
  }
  /* Privileges */
  async changeRoleUser(id, role) {
    try {
      return await this.dao.changeRoleUser(id, role);
    } catch (error) {
      return { error: error.message };
    }
  }
  /* Documents */
  async uploadDocuments(id, files, documents) {
    try {
      return await this.dao.uploadDocuments(id, files, documents);
    } catch (error) {
      return { error: error.message };
    }
  }
}
