import userModel from '../models/user.model.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';
import { uploadFileOnCloudinary } from '../utils/CloudinaryServices.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const RegisterUserController = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;

  if (
    [username, email, fullName, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(422, "Fields can't be empty");
  }

  const userExists = await userModel.findOne({
    $or: [{ email }, { username: username.toLowerCase() }],
  });

  if (userExists) {
    throw new ApiError(409, `Email or Username already in use`);
  }

  // Multer Middleware Send Fields

  const AvatarLocalPath = req.files?.avatar[0]?.path;
  const CoverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!AvatarLocalPath) {
    throw new ApiError(400, 'Avatar is Required!');
  }

  // Upload files On cloudinary

  const avatarUrl = await uploadFileOnCloudinary(AvatarLocalPath);
  const coverImageUrl = await uploadFileOnCloudinary(CoverImageLocalPath);

  if (!avatarUrl) {
    throw new ApiError(400, 'Avatar is Required!');
  }

  const NewUser = await userModel.create({
    fullName,
    avatar: avatarUrl.url,
    coverImage: coverImageUrl?.url || '',
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await NewUser.findById(NewUser._id).select(
    '-refreshToken -password',
  );

  if (!createdUser) {
    throw new ApiError(500, 'SomeThing Went Wrong While register User');
  }

  console.log(req.files);
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, 'User Register Successfully'));
});

export { RegisterUserController };
