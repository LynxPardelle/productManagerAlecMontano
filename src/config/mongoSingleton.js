import mongoose from "mongoose";
import config from "./config.js";
export const mongoUrl = config.mongoUrl || "";
export default class MongoSingleton {
  static #instance;
  constructor() {
    mongoose
      .connect(mongoUrl)
      .catch((error) => console.error("MongoDB connection failed.", error));
  }
  static getInstance() {
    if (!this.#instance) {
      this.#instance = new MongoSingleton();
      console.info("MongoDB connected successfully.");
    }
    return this.#instance;
  }
}
