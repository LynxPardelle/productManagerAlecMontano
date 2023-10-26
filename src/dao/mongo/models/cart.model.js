import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const Schema = mongoose.Schema;
const cartSchema = new Schema({
  products: [
    {
      type: {
        _id: { type: Schema.ObjectId, ref: "products", required: true },
        product: { type: Schema.ObjectId, ref: "products", required: true },
        quantity: { type: Number, required: true },
      },
    },
  ],
});
cartSchema.pre("find", function () {
  this.populate("products.product");
});
cartSchema.pre("findOne", function () {
  this.populate("products.product");
});
cartSchema.plugin(mongoosePaginate);
export const cartModel = mongoose.model("carts", cartSchema);
