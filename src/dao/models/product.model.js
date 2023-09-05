import mongoose from "mongoose";

export const productModel = mongoose.model(
  "products",
  new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    price: { type: Number, required: true },
    thumbnail: { type: String, max: 100 },
    code: { type: String, required: true, max: 100 },
    stock: { type: Number, required: true },
    status: { type: String, required: true, max: 100 },
    category: { type: String, required: true, max: 100 },
  })
);
