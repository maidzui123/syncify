import cloudinary from "../utils/cloudinary.js";
import sharp from "sharp";
import sendResponse from "../helper/sendResponse.helper.js";
import { ERROR } from "../constants/error.js";

const uploadFile = async (filePath, type, folderName, res) => {
  try {
    if (type === "image") {
      const resizedImageBuffer = await sharp(filePath)
        .resize(500, 500, { fit: "inside" })
        .webp({ quality: 50 })
        .png({ quality: 50 })
        .jpeg({ quality: 50 })
        .toBuffer();
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "image", folder: folderName },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(resizedImageBuffer);
      });
    } else if (type === "video" || type === "record") {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
          filePath,
          {
            resource_type: "video",
            folder: folderName,
            chunk_size: 6000000,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });
    }
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};
export { uploadFile };
