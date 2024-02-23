import UserModel from '../models/user.model.js';
import { generateAccessAndRefreshToken } from '../utils/AccessAndRefreshTokenGenerator.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';
import {
  DeleteImageFromCloudinary,
  uploadFileOnCloudinary,
} from '../utils/CloudinaryServices.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

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

  const userExists = await UserModel.findOne({
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

  const NewUser = await UserModel.create({
    fullName,
    avatar: {
      public_id: avatarUrl.public_id,
      url: avatarUrl.url,
    },
    coverImage: {
      public_id: coverImageUrl?.public_id || null,
      url: coverImageUrl?.url || null,
    },
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

  if (!(email || username)) {
    throw new ApiError(400, 'Username or Email is Required');
  }

  if (!password) {
    throw new ApiError(400, 'Password is required');
  }

  const user = await UserModel.findOne({
    $or: [{ email }, { username: username?.toLowerCase() }],
  });

  if (!user) {
    throw new ApiError(404, 'User Is Not Register');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid Credientials');
  }

  // Generate Access Token And Refresh Token
  const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

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

//Generate Refresh Token Controller
export const GenerateNewRefreshTokenController = asyncHandler(
  async (req, res) => {
    const IncomingRefreshToken =
      req.cookies.refreshToken || req.body.refrshToken;
    if (!IncomingRefreshToken) {
      throw new ApiError(401, 'Unathorized Request');
    }

    const DecodedToken = JWT.verify(
      IncomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const User = await UserModel.findById(DecodedToken?._id);
    if (!User) {
      throw new ApiError(401, 'Invalid Refresh Token');
    }
    console.log(IncomingRefreshToken === User.refreshToken);
    if (IncomingRefreshToken !== User.refreshToken) {
      throw new ApiError(401, 'Refresh Token Is Expired Or Already Used');
    }

    const option = {
      httpOnly: true,
      secure: true,
    };

    const { AccessToken, RefreshToken } = await generateAccessAndRefreshToken(
      User._id,
    );

    return res
      .status(200)
      .cookie('accessToken', AccessToken, option)
      .cookie('refreshToken', RefreshToken, option)
      .json(
        new ApiResponse(
          200,
          {
            accessToken: AccessToken,
            refreshToken: RefreshToken,
          },
          'Token Is Refreshed',
        ),
      );
  },
);

// Update Password Controller
export const UpdatePasswordController = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword, oldPassword } = req.body;
  if (newPassword !== confirmPassword) {
    throw new ApiError(400, 'New password and Confirm password does not match');
  }
  // get the user id
  const UserID = req.user?._id;

  if (!UserID) {
    throw new ApiError(400, 'No User ID Found');
  }

  // Const Find User
  const user = await UserModel.findById(UserID);
  if (!user) {
    throw new ApiError(404, 'User Not Found');
  }

  // check The Password Correct
  // Check The Old Password Is Correct
  const IsPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!IsPasswordCorrect) {
    throw new ApiError(401, 'Old Password Is Wrong');
  }

  // set New Password
  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Password Is Updated Successfully'));
});

// get current User
export const GetCurrentUser = asyncHandler(async (req, res) => {
  let user = req.user;

  res
    .status(200)
    .json(new ApiResponse(200, user, 'User Fetched Successfully '));
});

// update User Deatils Controller
export const UpdateUserDetailsController = asyncHandler(async (req, res) => {
  const { username, email, fullName } = req.body;

  const userId = req.user?._id;

  const user = await UserModel.findByIdAndUpdate(
    userId,
    {
      username: username,
      email: email,
      fullName,
    },
    { new: true },
  ).select('-password');

  //
  if (!user) {
    return res.status(401).json('User Not Found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User Details Update Successfully'));
});

// Avatar Update Contoller
export const UpdateAvatarController = asyncHandler(async (req, res) => {
  const AvatarLocalPath = req.file?.path;
  if (!AvatarLocalPath) {
    return res.status(400).send('Please Select Image');
  }

  // const Findt The user
  const userId = req.user?._id;

  const User = await UserModel.findById(userId);

  // upload New avatar Image
  const newAvatarUrl = await uploadFileOnCloudinary(AvatarLocalPath);
  if (!newAvatarUrl.url) {
    throw new ApiError(401, 'Imges Uploadation Error');
  }

  // Delete the old Image from cloudinary
  const ImageId = User.avatar.public_id;
  if (!ImageId) {
    throw new ApiError(400, 'No Public Id found for deletion');
  }
  const IsImageDeletd = await DeleteImageFromCloudinary(ImageId);

  console.log(IsImageDeletd);
  if (!IsImageDeletd) {
    throw new ApiError(401, 'Imges Uploadation Error');
  }

  // set the new avatr url
  User.avatar.public_id = newAvatarUrl.public_id;
  User.avatar.url = newAvatarUrl.url;

  // Save the user and get the updated document
  const updatedUser = await User.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'Image Updated Successfully'));
});

// Cover Image Update Controller
export const UpdateCoverImageController = asyncHandler(async (req, res) => {
  const CoverImageLocalPath = req.file?.path;

  if (!CoverImageLocalPath) {
    return res.status(400).send('Please Select Image');
  }

  // Find the user
  const userId = req.user?._id;

  const User = await UserModel.findById(userId);

  // Upload new cover image
  const newCoverImageUrl = await uploadFileOnCloudinary(CoverImageLocalPath);

  if (!newCoverImageUrl.url) {
    throw new ApiError(401, 'Images Uploadation Error');
  }

  // Delete the old cover image from Cloudinary
  const coverImageId = User.coverImage?.public_id;
  if (coverImageId) {
    const isCoverImageDeleted = await DeleteImageFromCloudinary(coverImageId);

    if (!isCoverImageDeleted) {
      throw new ApiError(402, 'Images Deletion Error');
    }
  }

  // Set the new cover image URL
  User.coverImage = {
    public_id: newCoverImageUrl.public_id,
    url: newCoverImageUrl.url,
  };

  // Save the user and get the updated document
  const updatedUser = await User.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, 'Cover Image Updated Successfully'),
    );
});

// Get User Channel Profile
export const GetUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new ApiError(400, 'Username parameter missing');
  }

  // aggregation Pipeline
  const channel = await UserModel.aggregate([
    // stage 1
    { $match: { username: username?.toLowerCase() } },

    // stage 2
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'channel',
        as: 'subscribers',
      },
    },

    // stage 3
    {
      $lookup: {
        from: 'subscriptions',
        localField: '_id',
        foreignField: 'subscriber',
        as: 'subscribedTo',
      },
    },
    // stage 4
    {
      $addFields: {
        subscribersCount: { $size: '$subscribers' },
        channelSubscribedToCount: { $size: '$subscribedTo' },
        isSubscribed: {
          $in: [
            new mongoose.Types.ObjectId(req.user?._id),
            '$subscribers.subscriber',
          ],
        },
      },
    },
    // stage 5
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(400, 'Channel is Not Present');
  }

  res.status(200).json(new ApiResponse(200, channel, 'User Channel Details '));
});

// Get The UserWatchHistory Contoller
export const GetUserWatchHistory = asyncHandler(async (req, res) => {
  const { userid } = req.user?._id;

  // sub Aggregation PipeLine
  const user = await UserModel.aggregate([
    //stage 1
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userid),
      },
    },

    {
      $lookup: {
        from: 'videos',
        localField: 'watchHistory',
        foreignField: '_id',
        as: 'watchHistory',

        // new PipeLine
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'owner',
              foreignField: '_id',
              as: 'owner',

              // new PipeLine

              pipeline: [
                {
                  $project: { fullName: 1, name: 1, avatar: 1 },
                },
              ],
            },
          },

          {
            $addFields: {
              owner: {
                $first: '$owner',
              },
            },
          },
        ],
      },
    },
  ]);

  // send Response

  res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, 'User Watch History'));
});
