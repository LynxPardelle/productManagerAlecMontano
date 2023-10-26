import config from "../config/config.js";

export let Products;
export let Carts;

switch (config.persistence) {
  case "FS":
    const { default: FSProducts } = await import("./fs/productFS.dao.js");
    const { default: FSCarts } = await import("./fs/cartFS.dao.js");
    Products = FSProducts;
    Carts = FSCarts;
    break;
  case "MONGO":
    const { default: MongoProducts } = await import(
      "./mongo/productMongo.dao.js"
    );
    const { default: MongoCarts } = await import("./mongo/cartMongo.dao.js");
    Products = MongoProducts;
    Carts = MongoCarts;
    break;
}
