import { cartModel } from "./models/cart.model.js";
import { productModel } from "./models/product.model.js";
export default {
  /* Create */
  async addCart(cart) {
    try {
      let newCart = {
        products: cart.products || [],
      };
      let cartCreated = await cartModel.create(newCart);
      if (!cartCreated) throw new Error("Error adding cart to BD");
      return {
        status: "success",
        message: "Cart added successfully",
        data: newCart,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error adding cart",
        error: error.message,
      };
    }
  },
  async addProductToCart(cid, pid) {
    try {
      let cart = cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");
      let product = await cart.products.find(
        (product) => product._id === parseInt(pid)
      );
      if (!!product) {
        product.quantity++;
      } else {
        cart.products.push({ _id: parseInt(pid), quantity: 1 });
      }
      let cartUpdated = await cartModel.updateOne({ _id: cid }, cart);
      if (!cartUpdated) throw new Error("Error updating cart");
      return {
        status: "success",
        message: "Cart updated successfully",
        data: cart,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error adding cart to cart",
        error: error.message,
      };
    }
  },
  /* Read */
  async getCartById(id) {
    try {
      let cart = await cartModel.findOn({ _id: id });
      if (!cart) throw new Error("Cart not found");
      cart.products = await Promise.all(
        cart.products.map(async (product) => {
          let productFound = await productModel.findOne({ _id: product._id });
          console.log(productFound);
          if (!!productFound) {
            product.product = productFound;
          }
          return product;
        })
      );
      return {
        status: "success",
        message: "Cart found successfully",
        data: cart,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error getting cart",
        error: error.message,
      };
    }
  },
};
