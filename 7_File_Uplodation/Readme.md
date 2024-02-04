# How To Upload Files in Backend

## Overview

This guide explores efficient backend development practices for uploading various types of files, such as images, videos, audio, etc. Learn about the multiple methods available for file upload and understand two prominent tools in this domain: Multer and Cloudinary.

## Table of Contents

1. [Multiple Methods of File Upload in Backend](#multiple-methods-of-file-upload-in-backend)
2. [What is Multer?](#what-is-multer)
3. [What is Cloudinary?](#what-is-cloudinary)
4. [Similar Tools Like Cloudinary](#similar-tools-like-cloudinary)
5. [Complete Example Of File Uploadation](#complete-example-of-file-uploadation)
   1. [Multer Middleware File](#multer-middleware-file)
   2. [Cloudinary Service File](#cloudinary-service-file)
   3. [Create a Controller](#create-a-controller)
   4. [Setup The Routes](#setup-the-routes)
6. [Example Source Code](#example-source-code)
7. [Connect with Me](#connect-with-me)

## Multiple Methods of File Upload in Backend

There are various methods to handle file uploads in a backend system. Understanding the available options allows you to choose the approach that best suits your application's needs. Some common methods include:

- **Direct File Upload:** Clients send files directly to the server, which saves them to disk or cloud storage.
- **Base64 Encoding:** Convert files to Base64 format and transmit them as strings in JSON requests. This method is suitable for smaller files but can increase payload size.

## What is Multer?

Multer is a middleware for handling `multipart/form-data`, primarily used for uploading files. It works seamlessly with Express.js and simplifies the process of handling file uploads by providing easy-to-use methods and configurations.

- [Read More About Multer](https://www.npmjs.com/package/multer)

## What is Cloudinary?

Cloudinary is a cloud-based service that offers an end-to-end image and video management solution. It provides robust features for uploading, storing, transforming, and delivering media files. Cloudinary's API is widely used for efficient media management in web applications.

## Similar Tools Like Cloudinary

While Cloudinary is a powerful tool, there are alternative services that offer similar functionalities. Some notable alternatives include:

- **Firebase Storage:** A cloud storage service provided by Google Firebase, offering easy integration with Firebase projects for seamless file uploads and retrieval.

- **AWS S3:** Amazon Simple Storage Service (S3) is a scalable object storage solution that supports secure and efficient storage and retrieval of files.

- **ImgIX:** A real-time image processing service that allows on-the-fly image transformations and optimizations for delivering high-quality images.

Explore these tools and choose the one that aligns with your project requirements for efficient and reliable file uploads in your backend system.

# Complete Example Of File Uplodation

**Multer MiddleWare File**

In this example, we'll cover the implementation of Multer middleware for handling file uploads in a Node.js backend. Multer simplifies the process of handling `multipart/form-data` and is commonly used with Express.

```js Multer.middleware.js
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Public/temp");
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage: storage });

export const multiUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverimage", maxCount: 1 },
]);
```

**Cloudinary Service File**

This section provides a Cloudinary service file that interacts with the Cloudinary API for file upload and management. Cloudinary is a cloud-based service offering end-to-end image and video management solutions.

```js
import fs from "fs";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
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
      folder: "ProductionBackendVideoTube",
      resource_type: "auto",
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
      throw new Error("Image not found in Cloudinary");
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { cloudinary, uploadFileOnCloudinary, DeleteImageFromCloudinary };
```

**Create a Controller**

This section presents a controller responsible for handling the file upload logic. It uses Multer middleware for file handling and Cloudinary for uploading files to the cloud.

```js
import { uploadFileOnCloudinary } from "../utils/CloudinaryServices";

export default UploadFile = async (req, res) => {
  try {
    // Multer Middleware Send Fields
    const AvatarLocalPath = req?.files?.avatar[0]?.path;
    let CoverImageLocalPath = req?.files?.coverimage;

    if (!AvatarLocalPath) {
      throw new ApiError(400, "Avatar is Required!");
    }
    // // Upload files On cloudinary
    const avatarUrl = await uploadFileOnCloudinary(AvatarLocalPath);

    // console.log(avatarUrl);
    if (!avatarUrl) {
      throw new ApiError(400, "Avatar is Required!");
    }

    let coverImageUrl;
    if (CoverImageLocalPath) {
      CoverImageLocalPath = req?.files?.coverimage[0]?.path;
      coverImageUrl = await uploadFileOnCloudinary(CoverImageLocalPath);
    }

    return res.status(200).send({
      success: true,
      message: "File Upload Successfully",
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Something Wrong",
    });
  }
};
```

**Setup The Routes**

Finally, we set up the routes for the file upload example, utilizing the previously defined controller and Multer middleware.

```js
import { Router } from "express";
import fileUploadController from "../controller/fileUpload.controller";

const router = Router();
router.route("/img-upload").post(multiUpload, fileUploadController);
```

Feel free to use and adapt this example for your backend development needs. Ensure that you have the necessary environment variables set for Cloudinary, and adjust file paths and routes accordingly based on your project structure.

**Example Source Code**

- [Source Code](Code)

## Connect with Me

Stay connected with me for more insights and updates on Production Level Backend Development:

- Linkedin: [![Linkedin](https://img.shields.io/badge/LinkedIn-Swarup%20Bhise-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/swarup-bhise-a981932aa/)

- GitHub: [![GitHub](https://img.shields.io/badge/GitHub-CoderSwarup-blue?style=flat&logo=github)](https://github.com/CoderSwarup)
- Instagram: [![Instagram](https://img.shields.io/badge/Instagram-swarup_bhise999-pink?style=flat&logo=instagram)](https://www.instagram.com/swarup_bhise999/)

Let's embark on a journey to become a skilled backend developer and create amazing web applications.

**Happy Coding!** 🎉
