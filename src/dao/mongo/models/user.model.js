import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { createHash } from "../../../utils/crypts.js";
const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["admin", "usuario"] },
});
userSchema.plugin(mongoosePaginate);
userSchema.pre("save", function (next) {
  // console.log(this);
  this.password = createHash(this.password);
  next();
});
export default mongoose.model("users", userSchema);