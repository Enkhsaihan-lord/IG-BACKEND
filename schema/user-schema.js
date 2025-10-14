import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  profilePicture: { type: String, required: false },
  bio: { type: String, required: false, default: null },
  followers: [{ type: Schema.Types.ObjectId, required: false }],
  following: [{ type: Schema.Types.ObjectId, required: false }],
  updateAt: { type: Date, default: Date.now() },
  createdAt: { type: Date, default: Date.now() },
});

export const userModel = mongoose.model("users", userSchema);
