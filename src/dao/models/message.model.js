import mongoose from "mongoose";
export default mongoose.model(
  "messages",
  new mongoose.Schema({
    user: { type: String, required: true, max: 100 },
    message: { type: String, required: true, max: 300 },
    date: { type: Date, required: true },
  })
);
