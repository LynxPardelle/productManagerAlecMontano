import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const messageSchema = new mongoose.Schema({
  user: { type: String, required: true, max: 100 },
  message: { type: String, required: true, max: 300 },
  date: { type: Date, required: true },
});
messageSchema.plugin(mongoosePaginate);
export default mongoose.model("messages", messageSchema);
