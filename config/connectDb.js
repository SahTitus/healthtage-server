import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); 
  } catch (err) {
    console.error(err);
  } 
};