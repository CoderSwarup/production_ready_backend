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
import {
  UploadVideosMulterMiddleware,
  upload,
} from '../middlewares/multer.middleware.js';

const router = Router();

router.route('/').get(getAllVideos);
router.route('/:videoId').get(getVideoById);

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route('/').post(UploadVideosMulterMiddleware, publishAVideo);

router
  .route('/:videoId')
  .delete(deleteVideo)
  .patch(upload.single('thumbnail'), updateVideo);

router.route('/toggle/publish/:videoId').patch(togglePublishStatus);

export default router;
