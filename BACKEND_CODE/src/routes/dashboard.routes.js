import { Router } from 'express';

import { verifyJWT } from '../middlewares/authMiddle.middleware.js';
import {
  getChannelStats,
  getChannelVideos,
} from '../controllers/dashboard.controller.js';

const router = Router();

// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route('/stats/:channelid').get(getChannelStats);
router.route('/videos/:channelid').get(getChannelVideos);

export default router;
