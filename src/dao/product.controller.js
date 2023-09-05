import { productModel } from "./models/product.model.js";
export const productController = {
  /* Create */
  async addProduct(product) {
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
      console.log("productPreCodeChecker", product);
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
      };
      console.log("productPreCreate", newProduct);
      let BDproduct = productModel.create(newProduct);
      if (!BDproduct) {
        throw new Error("Error adding product to BD");
      }
      console.log("BDproduct", BDproduct);
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
  async getProducts(limit = 0) {
    try {
      let products = await productModel.find();
      if (!products) throw new Error("Error getting products");
      if (products.length === 0) throw new Error("No products found");
      return {
        status: "success",
        message: "Products listed successfully",
        data: limit !== 0 ? products.slice(0, limit) : products,
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
  async getProductBy_id(_id) {
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
  async updateProduct(_id, product2Update) {
    try {
      let product = productModel.findOne({ _id: parseInt(_id) });
      if (!product) throw new Error("Product not found");
      product.title = product2Update.title;
      product.description = product2Update.description;
      product.price = product2Update.price;
      product.thumbnails = product2Update.thumbnails;
      product.stock = product2Update.stock;
      product.status = product2Update.status;
      product.category = product2Update.category;
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
  async deleteProduct(_id) {
    try {
      let product = productModel.findOne({ _id: parseInt(_id) });
      if (!product) throw new Error("Product not found");
      let productDeleter = await productModel.deleteOne({ _id: product._id });
      if (!productDeleter) throw new Error("Error deleting product");
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
setTimeout(() => {
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
}, 1000);
