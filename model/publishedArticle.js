import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
  _id: String,
  tags: Array,
  slug: String,
  title: String,
  image: String,
  author: String,
  content: String,
  summary: String,
  category: String,
  image_id: String,
  mini_card: Boolean,
  healthtage: Boolean,
  category_id: String,
  reading_time: String,
  saves: {
    type: [String],
    default: [],
  },
  publishedAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("PublishedArticle", articleSchema);
