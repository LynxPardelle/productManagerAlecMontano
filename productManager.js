const fs = require("fs");
class ProductManager {
  constructor(path = "./") {
    this.products = [];
    this.id = 0;
    this.path = path;
    (async () => {
      try {
        if (!(await fs.existsSync(this.path))) {
          await fs.mkdirSync(this.path, { recursive: true });
        }
        await fs.writeFileSync(
          this.path + "products.txt",
          JSON.stringify(this.products),
          "utf-8"
        );
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
          thumbnail: product.thumbnail,
          code: await this.getRandomCode(product.code),
          stock: product.stock,
          id: this.id,
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
      product.thumbnail = product2Update.thumbnail;
      product.stock = product2Update.stock;
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
      products = fs.readFileSync(this.path + "products.txt", "utf-8");
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
        this.path + "products.txt",
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
/* Module export */
module.exports = ProductManager;

/* 
// Testing:
let productManager = new ProductManager();
console.log(productManager.getProducts());
productManager.addProduct(
  {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
  }
);
console.log(productManager.getProducts());
productManager.addProduct(
  {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code: "abc123",
    stock: 25
  }
);
console.log(productManager.getProductById(0));
console.log(productManager.getProductById(1));
productManager.updateProduct(
  0,
  { title:"producto prueba(cambiado)",
    description:"Este es un producto prueba(cambiado)",
    price: 201,
    thumbnail: "Sin imagen",
    stock :24
  }
);
console.log(productManager.getProductById(0));
productManager.deleteProduct(0);
console.log(productManager.getProductById(0));
console.log(productManager.getProducts()); 
*/
