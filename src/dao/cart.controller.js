import { cartModel } from "./models/cart.model.js";
import { productModel } from "./models/product.model.js";
import mongoosePaginate from "mongoose-paginate-v2";
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
        data: cartCreated,
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
      let cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");
      console.log(cart.products);
      console.log(pid);
      let product = cart.products
        ? await cart.products.find((product) => {
            let productId = product._id
              .toString()
              .replace(/"/g, "")
              .replace("new ObjectId(", "")
              .replace(")", "");
            return productId === pid;
          })
        : null;
      if (!!product) {
        product.quantity++;
      } else {
        if (cart.products) {
          cart.products.push({ _id: pid, quantity: 1 });
        } else {
          cart.products = [{ _id: pid, quantity: 1 }];
        }
      }
      let cartUpdated = await cartModel.updateOne({ _id: cid }, cart);
      if (!cartUpdated) throw new Error("Error updating cart");
      cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");
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
      let cart = await cartModel.findOne({ _id: id });
      if (!cart) throw new Error("Cart not found");
      cart.products = await Promise.all(
        cart.products.map(async (product) => {
          let productId = product._id
            .toString()
            .replace(/"/g, "")
            .replace("new ObjectId(", "")
            .replace(")", "");
          let productFound = await productModel.findOne({ _id: productId });
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
  /* Update */
  async updateCart(id, cart) {
    try {
      let cartUpdated = await cartModel.updateOne({ _id: id }, cart);
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
        message: "Error updating cart",
        error: error.message,
      };
    }
  },
  async updateProductFromCart(cid, pid, product) {
    try {
      let cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");
      let productFound = await cart.products.find(
        (product) => product._id === parseInt(pid)
      );
      if (!!productFound) {
        productFound.quantity = product.quantity;
      } else {
        throw new Error("Product not found");
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
  /* Delete */
  async deleteProductFromCart(cid, pid) {
    try {
      let cart = await cartModel.findOne({ _id: cid });
      if (!cart) throw new Error("Cart not found");
      let product = await cart.products.find((product) => {
        let productId = product._id
          .toString()
          .replace(/"/g, "")
          .replace("new ObjectId(", "")
          .replace(")", "");
        return productId === pid;
      });
      if (!!product) {
        product.quantity--;
        if (product.quantity === 0) {
          cart.products = cart.products.filter((product) => {
            let productId = product._id
              .toString()
              .replace(/"/g, "")
              .replace("new ObjectId(", "")
              .replace(")", "");
            return productId !== pid;
          });
        }
      } else {
        throw new Error("Product not found");
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
};
