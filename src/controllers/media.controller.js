import { bucket } from "../config/db.js";
import crypto from "crypto";
import path from "path";
import Media from "../models/media.model.js";
import { ObjectId } from "mongodb";

/**
 * Upload media
 */
export const uploadMedia = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.uid;
    const file = req.file;

    if (!receiverId) {
      return res.status(400).json({ message: "receiverId required" });
    }

    if (!file) {
      return res.status(400).json({ message: "File not uploaded" });
    }

    const filename =
      crypto.randomBytes(16).toString("hex") +
      path.extname(file.originalname);

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: { senderId, receiverId },
    });

    uploadStream.end(file.buffer);

    uploadStream.on("finish", async () => {
      const media = await Media.create({
        fileId: uploadStream.id,
        uploadedBy: senderId,
        receiverId,
        mimeType: file.mimetype,
      });

      res.status(201).json({
        mediaId: media.fileId,
        mediaType: file.mimetype.split("/")[0],
        mediaUrl: `${req.protocol}://${req.get("host")}/api/media/${media.fileId}`,
        senderId,
        receiverId,
      });
    });

    uploadStream.on("error", (err) => {
      res.status(500).json({ message: err.message });
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get media
 */
export const getMedia = (req, res) => {
  const fileId = new ObjectId(req.params.id);
  bucket.openDownloadStream(fileId).pipe(res);
};
