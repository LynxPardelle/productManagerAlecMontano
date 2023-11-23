import ProductDTO from "./../dao/DTOs/product.DTO.js";

export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }
  /* Create */
  async addProduct(product, user) {
    try {
      const newProduct = new ProductDTO(product);
      return await this.dao.addProduct(newProduct, user);
    } catch (error) {
      return { error: error.message };
    }
  }
  /* Read */
  async getProducts(limit = 9999, page = 1, sort, query) {
    try {
      return await this.dao.getProducts(limit, page, sort, query);
    } catch (error) {
      return { error: error.message };
    }
  }
  async getProductById(id) {
    try {
      return await this.dao.getProductById(id);
    } catch (error) {
      return { error: error.message };
    }
  }
  /* Update */
  async updateProduct(id, product, user) {
    try {
      const productUpdated = new ProductDTO(product);
      return await this.dao.updateProduct(id, productUpdated, user);
    } catch (error) {
      return { error: error.message };
    }
  }
  /* Delete */
  async deleteProduct(id, user) {
    try {
      return await this.dao.deleteProduct(id, user);
    } catch (error) {
      return { error: error.message };
    }
  }
}
