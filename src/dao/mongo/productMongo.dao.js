import { productModel } from "./models/product.model.js";
import emailService from "../../services/mail/mail.js";
export default {
  /* Create */
  async addProduct(product, user) {
    try {
      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.stock ||
        !product.code ||
        !product.category
      )
        throw new Error("Missing data");
      let codeChecker = await getRandomCode(product.code);
      if (codeChecker !== product.code) throw new Error("Code already exists");
      let newProduct = {
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnails: product.thumbnail,
        code: await getRandomCode(product.code),
        stock: product.stock,
        status: product.status || true,
        category: product.category,
        owner:
          product.owner ||
          (["admin", "premium"].includes(user.role) ? user._id : undefined) ||
          "admin",
      };
      let BDproduct = productModel.create(newProduct);
      if (!BDproduct) {
        throw new Error("Error adding product to BD");
      }
      return {
        status: "success",
        message: "Product added successfully",
        data: BDproduct,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error adding product",
        error: error.message,
      };
    }
  },
  /* Read */
  async getProducts(limit = 9999, page = 1, sort, query) {
    try {
      let filter = !!query && !!isJsonString(query) ? JSON.parse(query) : {};
      function isJsonString(str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }
      let products = await productModel.paginate(filter, {
        limit: limit,
        page: page,
        sort: ["asc", "desc"].includes(sort) ? { price: sort } : {},
      });
      if (!products) throw new Error("Error getting products");
      if (products.length === 0) throw new Error("No products found");
      return {
        status: "success",
        message: "Products listed successfully",
        data: products,
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage
          ? `/products?page=${products.prevPage}&limit=${products.limit}${
              ["asc", "desc"].includes(sort) ? `&sort=${sort}` : ""
            }${!!filter ? `&query=${filter}` : ""}`
          : null,
        nextLink: products.hasNextPage
          ? `/products?page=${products.nextPage}&limit=${products.limit}${
              ["asc", "desc"].includes(sort) ? `&sort=${sort}` : ""
            }${!!filter ? `&query=${filter}` : ""}`
          : null,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error getting products",
        error: error.message,
      };
    }
  },
  async getProductById(_id) {
    try {
      let product = await productModel.find({ _id: _id });
      if (!product) throw new Error("Product not found");
      return {
        status: "success",
        message: "Product found successfully",
        data: product,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error getting product",
        error: error.message,
      };
    }
  },
  /* Update */
  async updateProduct(_id, product2Update, user) {
    try {
      let product = productModel.findOne({ _id: parseInt(_id) });
      if (!product) throw new Error("Product not found");
      if (
        !["admin", "premium"].includes(user.role) ||
        (user.role === "premium" && user._id !== product.owner)
      )
        throw new Error("You don't have permission to update this product");
      product.title = product2Update.title;
      product.description = product2Update.description;
      product.price = product2Update.price;
      product.thumbnails = product2Update.thumbnails;
      product.stock = product2Update.stock;
      product.status = product2Update.status;
      product.category = product2Update.category;
      product.owner = product2Update.owner || "admin";
      let updatedProduct = await productModel.updateOne(
        { _id: product._id },
        product
      );
      if (!updatedProduct) throw new Error("Error updating product");
      return {
        status: "success",
        message: "Product updated successfully",
        data: product,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error updating product",
        error: error.message,
      };
    }
  },
  /* Delete */
  async deleteProduct(_id, user) {
    try {
      let product = productModel.findOne({ _id: parseInt(_id) });
      if (!product) throw new Error("Product not found");
      if (
        !["admin", "premium"].includes(user.role) ||
        (user.role === "premium" && user._id !== product.owner)
      )
        throw new Error("You don't have permission to update this product");
      let productDeleted = await productModel.deleteOne({ _id: product._id });
      if (!productDeleted) throw new Error("Error deleting product");
      /* Send Email to the product owner if any */
      const owner = await userModel.findOne({ _id: product.owner });
      if (
        !!owner &&
        !!owner.email &&
        !!owner.role &&
        owner.role === "premium"
      ) {
        const mailBody = `
        <h1>Product eliminado</h1>
        <p>El producto ${product.title} ha sido eliminado.</p>
        `;
        const emailResult = await emailService.sendEmail(
          owner.email,
          "Product eliminado",
          mailBody
        );
        console.log(emailResult);
      }
      return {
        status: "success",
        message: "Product deleted successfully",
        data: product,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error deleting product",
        error: error.message,
      };
    }
  },
};
/* Utilities */
async function getRandomCode(code = "") {
  try {
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if (code.length === 0) {
      for (let i = 0; i <= 6; i++) {
        code += possible.charAt(Math.floor(Math.random() * possible.length));
      }
    }
    let codeExists = await productModel.findOne({ code: code });
    if (!!codeExists) {
      return await getRandomCode();
    } else {
      return code;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error getting random code");
  }
}
/* Create 10 products for testing */
/* setTimeout(() => {
  (async () => {
    let products = await productController.getProducts();
    if (!products || !products.data || products?.data?.length < 10) {
      console.error("no products");
      for (let i = 0; i < 10; i++) {
        let product = await productController.addProduct({
          title: `Product ${i}`,
          description: `Description ${i}`,
          price: Math.floor(Math.random() * 1000),
          thumbnails: `Thumbnail ${i}`,
          code: `Code ${i}`,
          stock: Math.floor(Math.random() * 100),
          category: `Category ${i}`,
        });
        console.log(product);
      }
    }
  })();
}, 1000); */
