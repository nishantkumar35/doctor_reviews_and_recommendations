const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async (filepath) => {
  try {
    const result = await cloudinary.uploader.upload(filepath);
    return result;
  } catch (e) {
    console.error("Cloudinary Upload Error:", e);
    throw new Error("Image upload failed");
  }
};

module.exports = uploadToCloudinary;
