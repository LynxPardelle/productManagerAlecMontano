import fs from "fs";
class ProductManager {
  file = "products.json";
  constructor(path = "./") {
    this.products = [];
    this.id = 0;
    this.path = path;
    (async () => {
      try {
        try {
          await this.readFile();
        } catch (error) {
          if (!(await fs.existsSync(this.path))) {
            await fs.mkdirSync(this.path, { recursive: true });
          }
          await fs.writeFileSync(
            this.path + this.file,
            JSON.stringify(this.products),
            "utf-8"
          );
        }
      } catch (error) {
        console.error("Error writing file");
        console.error(error);
        throw new Error("Error writing file");
      }
    })();
  }
  /* Create */
  async addProduct(product) {
    try {
      console.log(product);
      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.stock ||
        !product.code ||
        !product.category
      )
        throw new Error("Missing data");
      let fileReaded = await this.readFile();
      if (fileReaded?.status !== "success")
        throw new Error("Error reading file");
      let codeChecker = await this.getRandomCode(product.code);
      if (codeChecker !== product.code) {
        throw new Error("Code already exists");
      } else {
        let newProduct = {
          title: product.title,
          description: product.description,
          price: product.price,
          thumbnails: product.thumbnail,
          code: await this.getRandomCode(product.code),
          stock: product.stock,
          id: this.products.length + 1,
          status: product.status || true,
          category: product.category,
        };
        this.id++;
        this.products.push(newProduct);
        let fileWritten = await this.writeFile();
        if (fileWritten?.status !== "success")
          throw new Error("Error writing file");
        return {
          status: "success",
          message: "Product added successfully",
          data: newProduct,
        };
      }
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error adding product",
        error: error.message,
      };
    }
  }
  /* Read */
  async getProducts(limit = 0) {
    try {
      let fileReaded = await this.readFile();
      if (fileReaded?.status !== "success")
        throw new Error("Error reading file");
      if (!this.products || this.products.length === 0)
        throw new Error("There are no products");
      this.products.forEach((product) => {
        if (!!product.id && product.id == this.id) {
          this.id++;
        }
      });
      return {
        status: "success",
        message: "Products listed successfully",
        data: limit > 0 ? this.products.slice(0, limit) : this.products,
      };
    } catch (error) {
      console.error(error);
      return {
        status: "error",
        message: "Error getting products",
        error: error.message,
      };
    }
  }
  async getProductById(id) {
    try {
      let fileReaded = await this.readFile();
      if (fileReaded?.status !== "success")
        throw new Error("Error reading file");
      let product = await this.products.find(
        (product) => product.id === parseInt(id)
      );
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
  }
  async updateProduct(id, product2Update) {
    try {
      let fileReaded = await this.readFile();
      if (fileReaded?.status !== "success")
        throw new Error("Error reading file");
      let product = this.products.find(
        (product) => product.id === parseInt(id)
      );
      if (!product) throw new Error("Product not found");
      product.title = product2Update.title;
      product.description = product2Update.description;
      product.price = product2Update.price;
      product.thumbnails = product2Update.thumbnails;
      product.stock = product2Update.stock;
      product.status = product2Update.status;
      product.category = product2Update.category;
      let fileWritten = await this.writeFile();
      if (fileWritten?.status !== "success")
        throw new Error("Error writing file");
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
  }
  async deleteProduct(id) {
    try {
      let fileReaded = await this.readFile();
      if (fileReaded?.status !== "success")
        throw new Error("Error reading file");
      let product = this.products.find(
        (product) => product.id === parseInt(id)
      );
      if (!product) throw new Error("Product not found");
      this.products = this.products.filter(
        (product) => product.id !== parseInt(id)
      );
      let fileWritten = await this.writeFile();
      if (fileWritten?.status !== "success")
        throw new Error("Error writing file");
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
  }
  /* Utilities */
  async readFile() {
    try {
      let products = this.products;
      products = await fs.readFileSync(this.path + this.file, "utf-8");
      this.products = !!products ? JSON.parse(products) : [];
      return {
        status: "success",
        message: "File read successfully",
        data: this.products,
      };
    } catch (error) {
      console.error("Error reading file");
      console.error(error);
      throw new Error("Error reading file");
    }
  }
  async writeFile() {
    try {
      await fs.writeFileSync(
        this.path + this.file,
        JSON.stringify(this.products),
        "utf-8"
      );
      return {
        status: "success",
        message: "File written successfully",
      };
    } catch (error) {
      console.error("Error writing file");
      console.error(error);
      throw new Error("Error writing file");
    }
  }
  async getRandomCode(code = "") {
    try {
      let fileReaded = await this.readFile();
      if (fileReaded?.status !== "success") {
        throw new Error("Error reading file");
      }
      let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      if (code.length === 0) {
        for (let i = 0; i <= 6; i++) {
          code += possible.charAt(Math.floor(Math.random() * possible.length));
        }
      }
      let codeExists = this.products.find((product) => product.code === code);
      if (!!codeExists) {
        return this.getRandomCode();
      } else {
        return code;
      }
    } catch (error) {
      console.error(error);
      throw new Error("Error getting random code");
    }
  }
}
const productManager = new ProductManager("./data/");
/* Create 10 products for testing */
setTimeout(() => {
  (async () => {
    let products = await productManager.getProducts();
    if (!products || !products.data || products.data.length < 10) {
      for (let i = 0; i < 10; i++) {
        await productManager.addProduct({
          title: `Product ${i}`,
          description: `Description ${i}`,
          price: Math.floor(Math.random() * 1000),
          thumbnails: `Thumbnail ${i}`,
          code: `Code ${i}`,
          stock: Math.floor(Math.random() * 100),
          category: `Category ${i}`,
        });
      }
    }
  })();
}, 1000);
/* Module export */
export default productManager;
