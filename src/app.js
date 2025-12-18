import express from "express";
import cors from "cors";
import mediaRoutes from "./routes/media.routes.js";

const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());

app.use("/api/media", mediaRoutes);

export default app;
