import mongoose from "mongoose";

const aiQuerySchema = mongoose.Schema({
  id: String,
  query: String,
  country: String,



  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.model("Aiquery", aiQuerySchema);
