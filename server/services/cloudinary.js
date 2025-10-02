import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath, folder = "documents") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
    });
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

export { uploadToCloudinary };
