import express from "express";
import verifyFirebaseToken from "../middlewares/auth.middlewares.js";
import upload from "../middlewares/upload.middleware.js";
import {
  uploadMedia,
  getMedia,
} from "../controllers/media.controller.js";

const router = express.Router();

router.post(
  "/upload",
  verifyFirebaseToken,
  upload.single("file"),
  uploadMedia
);

router.get("/:id", getMedia);

export default router;
