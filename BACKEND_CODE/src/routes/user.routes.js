import { Router } from 'express';
import { RegisterUserController } from '../controllers/user.controller.js';

const UserRouter = Router();

UserRouter.route('/register').post(RegisterUserController);

export default UserRouter;
