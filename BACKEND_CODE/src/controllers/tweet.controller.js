import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';
import { Tweet } from '../models/tweet.model.js';
const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content } = req.body;

  if (!content || content == '') {
    throw new ApiError(400, 'All Fileds Required');
  }
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'User is Not Loggin');
  }

  const newTweet = await Tweet.create({
    content,
    owner: userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, newTweet, 'Tweet Posted Successfully'));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(401, 'User Is Not Valid');
  }

  const userTweets = await Tweet.find({ owner: userId }).sort('-createdAt');

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, 'Tweets Fetched Successfully'));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  const { content } = req.body;
  const userid = req.user?._id;

  if (!tweetId || tweetId.length < 24) {
    throw new ApiError(400, 'Tweet ID Not Valid');
  }

  if (!content || content == '') {
    throw new ApiError(400, 'All Fileds Required');
  }

  const tweet = await Tweet.findOne({
    $and: [{ _id: tweetId }, { owner: userid }],
  });

  if (!tweet) {
    throw new ApiError(401, 'Tweet Is Not Present');
  }

  tweet.content = content;

  const updatedTweet = await tweet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, 'Tweet Updated Successfully'));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;
  const userid = req.user?._id;

  if (!tweetId || tweetId.length < 24) {
    throw new ApiError(400, 'Tweet ID Not Valid');
  }

  const tweet = await Tweet.findOne({
    $and: [{ _id: tweetId }, { owner: userid }],
  });

  if (!tweet) {
    throw new ApiError(401, 'Tweet Is Not Present');
  }

  await Tweet.findByIdAndDelete(tweet._id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Tweet Deleted Successfully'));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
