import mongoose from "mongoose";

const topicSchema = mongoose.Schema({
  id: String,
  source: String,
  source_img: String,
  title: String,
  link: String,

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Topic", topicSchema);
