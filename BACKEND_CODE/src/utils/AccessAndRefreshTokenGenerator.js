import UserModel from '../models/user.model.js';
import { ApiError } from './ApiErrors.js';

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await UserModel.findById(userId);

    const AccessToken = user.generateAccessToken();
    const RefreshToken = user.generateRefreshToken();

    // Save the Refresh Token In Database
    user.refreshToken = RefreshToken;
    await user.save({ validateBeforeSave: false }); // Not Required Validation

    return { AccessToken, RefreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something Went Wrong With Access and Refresh Token',
    );
  }
};

export { generateAccessAndRefreshToken };
