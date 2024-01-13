import { Router } from 'express';
import { RegisterUserController } from '../controllers/user.controller.js';
import { multiUpload } from '../middlewares/multer.Middleware.js';
const UserRouter = Router();

UserRouter.route('/register').post(
  multiUpload,

  RegisterUserController,
);

export default UserRouter;
