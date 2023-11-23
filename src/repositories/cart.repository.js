import CartDTO from "./../dao/DTOs/cart.DTO.js";

export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }
  /* Create */
  async addCart(cart) {
    try {
      const newCart = new CartDTO(cart);
      return await this.dao.addCart(newCart);
    } catch (error) {
      return { error: error.message };
    }
  }
  async addProductToCart(cartId, productId, userId) {
    try {
      return await this.dao.addProductToCart(cartId, productId, userId);
    } catch (error) {
      return { error: error.message };
    }
  }
  /* Read */
  async getCartById(id) {
    try {
      return await this.dao.getCartById(id);
    } catch (error) {
      return { error: error.message };
    }
  }
  /* Update */
  async updateCart(id, cart) {
    try {
      const cartUpdated = new CartDTO(cart);
      return await this.dao.updateCart(id, cartUpdated);
    } catch (error) {
      return { error: error.message };
    }
  }
  async updateProductFromCart(cartId, productId, product) {
    try {
      return await this.dao.updateProductFromCart(cartId, productId, product);
    } catch (error) {
      return { error: error.message };
    }
  }
  async purchaseCart(cartId, userEmail) {
    try {
      return await this.dao.purchaseCart(cartId, userEmail);
    } catch (error) {
      return { error: error.message };
    }
  }
  /* Delete */
  async deleteProductFromCart(cartId, productId) {
    try {
      return await this.dao.deleteProductFromCart(cartId, productId);
    } catch (error) {
      return { error: error.message };
    }
  }
}
