import { Router } from 'express';
import { RegisterUserController } from '../controllers/user.controller.js';
import { multiUpload } from '../middlewares/multer.Middleware.js';
const UserRouter = Router();
/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with username, email, fullName, password, avatar, and cover image.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               fullName:
 *                 type: string
 *               password:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *               coverimage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request, check the request payload
 *         content:
 *           application/json:
 *             example:
 *               error: All fields are required
 *       '422':
 *         description: Unprocessable Entity, check the request payload
 *         content:
 *           application/json:
 *             example:
 *               error: Fields can't be empty
 *       '409':
 *         description: Conflict, email or username already in use
 *         content:
 *           application/json:
 *             example:
 *               error: Email or Username already in use
 */
UserRouter.route('/register').post(
  multiUpload,

  RegisterUserController,
);

export default UserRouter;
