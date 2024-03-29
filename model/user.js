import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: "String", required: true },
  isGoogle: Boolean,
  password: { type: "String", required: true },
  email: { type: "String", required: true },
  favoriteArticles: {
    type: [String],
    default: [],
  },
  photo: {
    type: String,
  },
  emailVerified: Boolean,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
export default mongoose.model("User", userSchema);
