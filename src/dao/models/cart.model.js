import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
let cartSchema = new mongoose.Schema({
  products: [
    {
      type: {
        _id: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    },
  ],
});
cartSchema.pre("find", () => {
  this.populate("products");
});
cartSchema.pre("findOne", () => {
  this.populate("products");
});
cartSchema.plugin(mongoosePaginate);
export const cartModel = mongoose.model("carts", cartSchema);
