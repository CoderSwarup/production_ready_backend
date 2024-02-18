import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';

import { Video } from '../models/video.model.js';
import mongoose from 'mongoose';
const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  // const user = req.user;
  const { channelid } = req.params;

  if (!channelid) throw new ApiError('Not Accessible', 401);

  const channelStats = await Video.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(channelid) },
    },
    {
      $lookup: {
        from: 'likes',
        localField: '_id',
        foreignField: 'video',
        as: 'likes',
      },
    },
    {
      $addFields: {
        likes: {
          $size: '$likes',
        },
      },
    },
    {
      $group: {
        _id: channelid,
        totalviews: {
          $sum: '$views',
        },
        totalVideo: {
          $sum: 1,
        },
        totalLikes: {
          $sum: '$likes',
        },
      },
    },
    {
      $addFields: {
        owner: new mongoose.Types.ObjectId(channelid),
      },
    },
    {
      $lookup: {
        from: 'subscriptions',
        localField: 'owner',
        foreignField: 'channel',
        as: 'totalSubscriber',
      },
    },
    {
      $addFields: {
        totalSubscriber: {
          $size: '$totalSubscriber',
        },
      },
    },

    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: '_id',
        as: 'channeldetail',
      },
    },
    { $unwind: '$channeldetail' },

    {
      $project: {
        // _id: 0,
        owner: 0,
        channeldetail: {
          password: 0,
          watchHistory: 0,
          refreshToken: 0,
        },
      },
    },
  ]);

  // console.log(channelStats);
  return res
    .status(200)
    .json(
      new ApiResponse(200, channelStats, 'Channel Stats Fetch Successfully'),
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  // const user = req.user;
  const { channelid } = req.params;

  let { page = 1, limit = 10, sortBy, sortType } = req.query;

  // console.log(user);
  if (!channelid) {
    throw new ApiError(401, 'Please Provide the  Channel ID');
  }

  page = isNaN(page) ? 1 : Number(page);
  limit = isNaN(limit) ? 10 : Number(limit);

  if (page <= 0) {
    page = 1;
  }
  if (limit <= 10) {
    limit = 10;
  }

  const sortStage = {};
  if (sortBy && sortType) {
    sortStage['$sort'] = {
      [sortBy]: sortType === 'asc' ? 1 : -1,
    };
  } else {
    sortStage['$sort'] = {
      createdAt: -1,
    };
  }

  // console.log(user);
  const channelVideos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelid),
      },
    },
    sortStage,
    {
      $project: {
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        views: 1,
        duration: 1,
        title: 1,
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelVideos,
        'Successfully fetched channel videos!',
      ),
    );
});

export { getChannelStats, getChannelVideos };
