import { Router } from 'express';
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from '../controllers/video.controller.js';
import { verifyJWT } from '../middlewares/authMiddle.middleware.js';
import { UploadVideosMulterMiddleware } from '../middlewares/multer.middleware.js';

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
  .route('/')
  .get(getAllVideos)
  .post(UploadVideosMulterMiddleware, publishAVideo);

router
  .route('/:videoId')
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single('thumbnail'), updateVideo);

router.route('/toggle/publish/:videoId').patch(togglePublishStatus);

export default router;
