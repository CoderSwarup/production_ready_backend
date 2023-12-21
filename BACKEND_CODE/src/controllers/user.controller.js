import { asyncHandler } from '../utils/asyncHandler.js';

const RegisterUserController = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Registered User Successfully!',
  });
});

export { RegisterUserController };
