import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
    fileId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    uploadedBy:{
        type:String,
        required:true,
    },
    mimeType:String,
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

export default mongoose.model("Media",mediaSchema)