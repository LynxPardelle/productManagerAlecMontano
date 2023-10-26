export default class ProductDTO {
  constructor(product) {
    this.name = product.name ?? "Unknow";
    this.price = product.price ?? 0;
    this.description = product.description ?? "Unknow";
    this.code = product.code ?? "Unknow";
    this.stock = product.stock ?? 0;
    this.image = product.image ?? "Unknow";
  }
}
