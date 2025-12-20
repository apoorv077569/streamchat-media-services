import { bucket } from "../config/db.js";
import crypto from "crypto";
import path from "path";
import Media from "../models/media.model.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

/**
 * Upload media
 */
// export const uploadMedia = async (req, res) => {
//   try {
//     const { receiverId } = req.body;
//     const senderId = req.user.uid;
//     const file = req.file;

//     let originalName = file.originalName || "file";
//     let ext = path.extname(originalName);

//     if (!receiverId) {
//       return res.status(400).json({ message: "receiverId required" });
//     }

//     if (!file) {
//       return res.status(400).json({ message: "File not uploaded" });
//     }

//     const filename =
//       crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);

//     const uploadStream = bucket.openUploadStream(filename, {
//       contentType: file.mimetype,
//       metadata: { senderId, receiverId },
//     });




//     uploadStream.end(file.buffer);

//     uploadStream.on("finish", async () => {
//       const media = await Media.create({
//         fileId: uploadStream.id,
//         filename:file.originalname,
//         uploadedBy: senderId,
//         receiverId,
//         mimeType: file.mimetype,
//       });

//       res.status(201).json({
//         mediaId: media.fileId,
//         mediaType: file.mimetype.split("/")[0],
//         mediaName:file.originalname,
//         mediaUrl: `${req.protocol}://${req.get("host")}/api/media/${
//           media.fileId
//         }`,
//         senderId,
//         receiverId,
//       });
//     });

//     uploadStream.on("error", (err) => {
//       res.status(500).json({ message: err.message });
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



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

    // ✅ ORIGINAL FILE NAME WITH EXTENSION
    const originalName = file.originalname;

    // ✅ EXTENSION (.jpg, .pdf)
    const ext = path.extname(originalName);

    // ✅ SAFE STORED NAME
    const filename =
      crypto.randomBytes(16).toString("hex") + ext;

    // ✅ UPLOAD TO GRIDFS
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.mimetype,
      metadata: {
        originalName,
        senderId,
        receiverId,
      },
    });

    uploadStream.end(file.buffer);

    uploadStream.on("finish", async () => {
      const media = await Media.create({
        fileId: uploadStream.id,
        filename,              // stored filename
        originalName,           // 👈 IMPORTANT
        uploadedBy: senderId,
        receiverId,
        mimeType: file.mimetype,
      });

      res.status(201).json({
        mediaId: media.fileId,
        mediaType: file.mimetype,
        mediaName: originalName,   // 👈 SEND BACK ORIGINAL NAME
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

export const getMedia = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);

    const files = await bucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }
    const file = files[0];
    res.set({
      "Content-Type": file.contentType || "application/octet-stream",
      "Content-Length": file.length,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000",
      Connection: "close",
    });

    bucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};