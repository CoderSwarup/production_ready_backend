import { Router } from 'express';
import {
  GenerateNewRefreshTokenController,
  LoginUserController,
  LogoutUserController,
  RegisterUserController,
} from '../controllers/user.controller.js';
import { multiUpload } from '../middlewares/multer.Middleware.js';
import { verifyJWT } from '../middlewares/authMiddle.middleware.js';
const UserRouter = Router();

UserRouter.route('/register').post(multiUpload, RegisterUserController);

//Login Route
UserRouter.route('/login').post(LoginUserController);

// Refreshed Token
UserRouter.route('/refresh-token').post(GenerateNewRefreshTokenController);

//+++++++++++ Secure Routes ++++++
UserRouter.route('/logout').post(verifyJWT, LogoutUserController);
export default UserRouter;
