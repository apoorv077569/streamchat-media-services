import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import {connectDB} from "./src/config/db.js";
import { connectMongoose } from "./src/config/mongoose.js";


await connectDB();
await connectMongoose();
app.listen(process.env.PORT, () => {
  console.log(`🚀 Media backend running on http://localhost:${process.env.PORT}`);
});
