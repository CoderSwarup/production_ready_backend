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
