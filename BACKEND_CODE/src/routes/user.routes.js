import { Router } from 'express';
import { RegisterUserController } from '../controllers/user.controller.js';
import { upload } from '../middlewares/multer.Middleware.js';
const UserRouter = Router();

UserRouter.route('/register').post(
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),

  RegisterUserController,
);

export default UserRouter;
