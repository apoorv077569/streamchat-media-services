import { MongoClient, GridFSBucket } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

export let bucket;

export async function connectDB() {
  await client.connect();
  const db = client.db();
  bucket = new GridFSBucket(db, { bucketName: "media" });
  console.log("MongoDB connected with GridFS");
}
