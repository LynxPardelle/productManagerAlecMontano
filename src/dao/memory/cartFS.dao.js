import fs from "fs";
import productManager from "./productFSManager.js";
class CartManager {
  file = "cart.json";
  constructor(path = "./") {
    this.carts = [];
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
            JSON.stringify(this.carts),
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
  async addCart(cart) {
    try {
      let fileReaded = await this.readFile();
      if (fileReaded?.status !== "success")
        throw new Error("Error reading file");
      let newCart = {
        id: this.carts.length + 1,
        products: cart.products || [],
      };
      this.id++;
      console.log(this.id);
      this.carts.push(newCart);
      let fileWritten = await this.writeFile();
      if (fileWritten?.status !== "success")
        throw new Error("Error writing file");
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
  }
  async addProductToCart(cid, pid) {
    try {
      let fileReaded = await this.readFile();
      if (fileReaded?.status !== "success")
        throw new Error("Error reading file");
      let cart = this.carts.find((cart) => cart.id === parseInt(cid));
      if (!cart) throw new Error("Cart not found");
      let product = await cart.products.find(
        (product) => product.id === parseInt(pid)
      );
      if (!!product) {
        product.quantity++;
      } else {
        cart.products.push({ id: parseInt(pid), quantity: 1 });
      }
      let fileWritten = await this.writeFile();
      if (fileWritten?.status !== "success")
        throw new Error("Error writing file");
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
  }
  /* Read */
  async getCartById(id) {
    try {
      let fileReaded = await this.readFile();
      if (fileReaded?.status !== "success")
        throw new Error("Error reading file");
      let cart = await this.carts.find((cart) => {
        return cart.id === parseInt(id);
      });
      if (!cart) throw new Error("Cart not found");
      let products = await productManager.getProducts();
      if (!!products?.data) {
        cart.products = await Promise.all(
          cart.products.map(async (product) => {
            let productFound = await products.data?.find(
              (p) => p.id === product.id
            );
            console.log(productFound);
            if (!!productFound) {
              product.product = productFound;
            }
            return product;
          })
        );
      }
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
  }
  /* Utilities */
  async readFile() {
    try {
      let carts = this.carts;
      carts = await fs.readFileSync(this.path + this.file, "utf-8");
      this.carts = !!carts ? JSON.parse(carts) : [];
      return {
        status: "success",
        message: "File read successfully",
        data: this.carts,
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
        JSON.stringify(this.carts),
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
}
const cartManager = new CartManager("./data/");
/* Module export */
export default cartManager;
