import mongoose from "mongoose";
import { Schema } from "mongoose";
const postSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, required: false, ref: "users" },
  caption: { type: String, required: true },
  like: [{ type: Schema.Types.ObjectId, required: true }],
  images: {
    type: [{ type: String, required: true }],
    required: true,
  },
  Comment: [{ type: Schema.Types.ObjectId, required: false }],
  updateAt: { type: Date, default: Date.now() },
  createdAt: { type: Date, default: Date.now() },
});
export const postModel = mongoose.model("posts", postSchema);
