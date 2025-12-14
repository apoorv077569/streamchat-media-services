import mongoose from "mongoose";

export async function connectMongoose() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongoose connected");
}
