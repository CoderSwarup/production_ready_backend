import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';
import { Like } from '../models/like.model.js';
import mongoose from 'mongoose';

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  const userId = req.user?._id;

  //  // Check if the user has already liked the video
  const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

  if (existingLike) {
    // If the user has already liked the video, remove the like
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse('success', `You have unliked this video`));
  } else {
    // If the user hasn't liked the video, add the like
    const newLike = new Like({ video: videoId, likedBy: userId });
    await newLike.save();
    return res
      .status(200)
      .json(new ApiResponse('success', `You have liked this video`));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user?._id;

  // Check if the user has already liked the comment
  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId,
  });

  if (existingLike) {
    // If the user has already liked the comment, remove the like
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse('success', `You have unliked this comment`));
  } else {
    // If the user hasn't liked the comment, add the like
    const newLike = new Like({ comment: commentId, likedBy: userId });
    await newLike.save();
    return res
      .status(200)
      .json(new ApiResponse('success', `You have liked this comment`));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user?._id;

  // Check if the user has already liked the tweet
  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: userId,
  });

  if (existingLike) {
    // If the user has already liked the tweet, remove the like
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse('success', `You have unliked this tweet`));
  } else {
    // If the user hasn't liked the tweet, add the like
    const newLike = new Like({ tweet: tweetId, likedBy: userId });
    await newLike.save();
    return res
      .status(200)
      .json(new ApiResponse('success', `You have liked this tweet`));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  // Get the user ID from the request
  const userId = req.user?.id;

  // Define the aggregation pipeline
  const pipeline = [
    // Match likes by the user ID
    { $match: { likedBy: new mongoose.Types.ObjectId(userId) } },
    // Lookup videos by video ID
    {
      $lookup: {
        from: 'videos', // Collection name
        localField: 'video',
        foreignField: '_id',
        as: 'video', // Use singular 'video' instead of 'videos'
      },
    },
    // Unwind the videos array
    { $unwind: '$video' }, // Unwind the array to destructure each video
    // Project to shape the output
    {
      $project: {
        _id: 1,
        likedBy: 1,
        video: '$video', // Use the unwinded video field
      },
    },
  ];

  // Execute the aggregation pipeline
  const likedVideos = await Like.aggregate(pipeline);

  // Return the liked videos
  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, 'Liked Videos Fetch Successfully'));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
