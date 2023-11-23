import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 100 },
  description: { type: String, required: true, max: 100 },
  price: { type: Number, required: true },
  thumbnail: { type: String, max: 100 },
  code: { type: String, required: true, max: 100 },
  stock: { type: Number, index: true, required: true },
  status: { type: String, required: true, max: 100 },
  category: { type: String, index: true, required: true, max: 100 },
  owner: { type: Schema.ObjectId, ref: "users" } || "admin",
});
productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model("products", productSchema);
