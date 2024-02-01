import { Router } from 'express';
import {
  GenerateNewRefreshTokenController,
  GetCurrentUser,
  GetUserChannelProfile,
  LoginUserController,
  LogoutUserController,
  RegisterUserController,
  UpdateAvatarController,
  UpdateCoverImageController,
  UpdatePasswordController,
  UpdateUserDetailsController,
} from '../controllers/user.controller.js';
import { multiUpload, upload } from '../middlewares/multer.Middleware.js';
import { verifyJWT } from '../middlewares/authMiddle.middleware.js';
const UserRouter = Router();

UserRouter.route('/register').post(multiUpload, RegisterUserController);

//Login Route
UserRouter.route('/login').post(LoginUserController);

// Refreshed Token
UserRouter.route('/refresh-token').post(GenerateNewRefreshTokenController);

//+++++++++++ Secure Routes ++++++
UserRouter.route('/logout').post(verifyJWT, LogoutUserController);

//Update Password Controller
UserRouter.route('/updatePassword').put(verifyJWT, UpdatePasswordController);

// get Login User Details
UserRouter.route('/get-user-details').get(verifyJWT, GetCurrentUser);

// Update User Details
UserRouter.route('/update-user').post(verifyJWT, UpdateUserDetailsController);

// Avatr Images Upadate Route
UserRouter.route('/update/user-avatar').post(
  verifyJWT,
  upload.single('avatar'),
  UpdateAvatarController,
);

UserRouter.route('/update/user-coverimage').post(
  verifyJWT,
  upload.single('coverimage'),
  UpdateCoverImageController,
);

// Get User Channel Profile
UserRouter.route('/channelprofile/:username').get(
  verifyJWT,
  GetUserChannelProfile,
);
export default UserRouter;
