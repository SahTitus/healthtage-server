import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
  link: String,
  title: String,
  image: String,
  source: String,
  mini_card: Boolean,
  source_img: String,
  saves: {
    type: [String],
    default: [],
  },
});

export default mongoose.model("Articles", articleSchema);
