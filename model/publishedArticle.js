import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
  tag: Array,
  slug: String,
  link: String,
  title: String,
  image: String,
  author: String,
  content: String,
  summary: String,
  category: String,
  mini_card: Boolean,
  healthtage: Boolean,
  category_id: String,
  reading_time: String,
  publishedAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("PublishedArticle", articleSchema);
