import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadUserAvatar = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "Inklr/user-Avatar",
      resource_type: "image",
      public_id: `${Date.now()}-${path
        .parse(file.originalname)
        .name.replace(/\s+/g, "-")}`,
    });
    fs.unlinkSync(file.path);
    return {
      url: result.secure_url,
      public_id: result.public_id,
      created_at: result.created_at,
    };
  } catch (error) {
    fs.unlinkSync(file.path);
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

const deleteUserAvatar = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      invalidate: true,
      resource_type: "image",
    });

    if (result.result !== "ok") {
      throw new Error(`Cloudinary delete failed: ${result.result}`);
    }

    return result;
  } catch (error) {
    console.error("Cloudinary deletion error:", error.message);
    throw new Error("Failed to delete image.");
  }
};

const uploadBlogImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "Inklr/Blog-image",
      resource_type: "auto",
      public_id: `${Date.now()}-${path
        .parse(file.originalname)
        .name.replace(/\s+/g, "-")}`,
    });
  } catch (error) {
    fs.unlinkSync(file.path);
    console.error("Error uploading Blog Image:", error);
    throw error;
  }
};

const deleteBlogImage = async () => {
  try {
    const result = await cloudinary.uploader.destroy(public_id, {
      invalidate: true,
    });
    if (result.result !== "ok") {
      throw new Error(`Cloudinary delete failed: ${result.result}`);
    }

    return result;
  } catch (error) {
    console.error("Cloudinary deletion error:", error.message);
    throw new Error("Failed to delete image.");
  }
};

export { uploadUserAvatar, deleteUserAvatar, uploadBlogImage, deleteBlogImage };
