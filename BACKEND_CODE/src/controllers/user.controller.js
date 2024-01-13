import UserModel from '../models/user.model.js';
import userModel from '../models/user.model.js';
import { generateAccessAndRefreshToken } from '../utils/AccessAndRefreshTokenGenerator.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';
import { uploadFileOnCloudinary } from '../utils/CloudinaryServices.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const RegisterUserController = asyncHandler(async (req, res) => {
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

//Login User Controller
export const LoginUserController = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username) {
    throw new ApiError(400, 'Username or Email is Required');
  }

  if (!password) {
    throw new ApiError(400, 'Password is required');
  }

  const user = await UserModel.findOne({
    $or: [{ email }, { username: username.toLowerCase() }],
  });

  if (!user) {
    throw new ApiError(404, 'User Is Not Register');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid Credientials');
  }

  // Generate Access Token And Refresh Token
  const { AccessToken, RefreshToken } = generateAccessAndRefreshToken(user._id);

  // USelect the Not Requires Data To send The User
  const LoggedInUserData = await UserModel.findById(user._id).select(
    '-password -refreshToken',
  );

  // Setup Cookies Options

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  // Send Response
  return res
    .status(200)
    .cookie('accessToken', AccessToken, cookieOptions)
    .cookie('refreshToken', RefreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: LoggedInUserData,
          AccessToken,
          RefreshToken,
        },
        'User Logged In SuccessFully',
      ),
    );
});

// Logout User
export const LogoutUserController = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  await UserModel.findByIdAndUpdate(
    _id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, // Retunr New Updated Value
    },
  );

  // Send Response
  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'User LoggedOut Successfully'));
});
