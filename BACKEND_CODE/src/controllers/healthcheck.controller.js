import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';
const healthcheck = asyncHandler(async (req, res) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
  const data = new Date();
  return res
    .status(200)
    .json(new ApiResponse('success', `Server time is ${data}`));
});

export { healthcheck };
