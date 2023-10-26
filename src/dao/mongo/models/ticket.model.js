import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const Schema = mongoose.Schema;
const ticketSchema = new Schema({
  code: { type: String, required: true, max: 100, unique: true },
  purchase_datetime: { type: Date, required: true },
  amount: { type: Number, required: true },
  purchaser: { type: String, required: true },
});
ticketSchema.plugin(mongoosePaginate);
export const ticketModel = mongoose.model("tickets", ticketSchema);
