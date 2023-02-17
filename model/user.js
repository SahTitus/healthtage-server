import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: { type: "String", required: true },
  email: { type: "String", required: true },
  favoriteArticles: {
    type: [String],
    default: [],
  },
  photo: {
    type: String,
  },
  emailVerified: Boolean,
});
export default mongoose.model("User", userSchema);
