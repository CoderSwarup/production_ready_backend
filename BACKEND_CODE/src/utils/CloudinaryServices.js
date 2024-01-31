import fs from 'fs';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFileOnCloudinary = async (localFilePath) => {
  try {
    // if (localFilePath === '') return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: 'ProductionBackendVideoTube',
      resource_type: 'auto',
    });

    // console.log('file is uploaded on cloudinary ', response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // console.log(error);
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const DeleteImageFromCloudinary = async (imageId) => {
  try {
    const response = await cloudinary.uploader.destroy(imageId);
    if (!response.result) {
      throw new Error('Image not found in Cloudinary');
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { cloudinary, uploadFileOnCloudinary, DeleteImageFromCloudinary };
