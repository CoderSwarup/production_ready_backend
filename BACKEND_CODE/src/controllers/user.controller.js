import UserModel from '../models/user.model.js';
import userModel from '../models/user.model.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';
import { uploadFileOnCloudinary } from '../utils/CloudinaryServices.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const RegisterUserController = asyncHandler(async (req, res) => {
  const { username, email, fullName, password } = req.body;

  if (!username || !email || !fullName || !password) {
    throw new ApiError(422, 'All fields are required');
  }
  if (
    [username, email, fullName, password].some(
      (field) => typeof field === 'string' && field.trim() === '',
    )
  ) {
    console.log('hellow');
    throw new ApiError(422, "Fields can't be empty");
  }

  const userExists = await userModel.findOne({
    $or: [{ email }, { username: username.toLowerCase() }],
  });

  if (userExists) {
    throw new ApiError(409, `Email or Username already in use`);
  }

  // Multer Middleware Send Fields
  const AvatarLocalPath = req?.files?.avatar[0]?.path;
  let CoverImageLocalPath = req?.files?.coverimage;

  if (!AvatarLocalPath) {
    throw new ApiError(400, 'Avatar is Required!');
  }
  // // Upload files On cloudinary
  const avatarUrl = await uploadFileOnCloudinary(AvatarLocalPath);

  // console.log(avatarUrl);
  if (!avatarUrl) {
    throw new ApiError(400, 'Avatar is Required!');
  }

  let coverImageUrl;
  if (CoverImageLocalPath) {
    CoverImageLocalPath = req?.files?.coverimage[0]?.path;
    coverImageUrl = await uploadFileOnCloudinary(CoverImageLocalPath);
  }

  const NewUser = await userModel.create({
    fullName,
    avatar: avatarUrl.url,
    coverImage: coverImageUrl?.url || null,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await UserModel.findById(NewUser._id).select(
    '-refreshToken -password',
  );

  if (!createdUser) {
    throw new ApiError(500, 'SomeThing Went Wrong While register User');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, 'User Register Successfully'));
});

export { RegisterUserController };
