import mongoose from "mongoose";

export const cartModel = mongoose.model(
  "carts",
  new mongoose.Schema({
    products: [
      {
        type: {
          _id: { type: Number, required: true },
          quantity: { type: Number, required: true },
        },
      },
    ],
  })
);
