import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';
import SubscriptionModel from '../models/subcription.model.js';
import mongoose from 'mongoose';

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const userID = req.user?._id;
  // Check if the user is already subscribed to the channel
  const isSubscribed = await SubscriptionModel.findOne({
    channel: channelId,
    subscriber: userID,
  });

  // If the user is already subscribed, unsubscribe
  if (isSubscribed) {
    await SubscriptionModel.findByIdAndDelete(isSubscribed._id);
    return res
      .status(200)
      .json(
        new ApiResponse(
          'success',
          `Unsubscribed from the channel successfully.`,
        ),
      );
  } else {
    // If the user is not subscribed, subscribe
    await SubscriptionModel.create({
      channel: channelId,
      subscriber: userID,
    });

    return res
      .status(200)
      .json(
        new ApiResponse('success', `Subscribed to the channel successfully.`),
      );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // const users = await SubscriptionModel.find({ channel: channelId });
  const users = await SubscriptionModel.aggregate([
    {
      $match: { channel: new mongoose.Types.ObjectId(channelId) },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'subscriber',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        'user._id': 1,
        'user.email': 1,
        'user.fullName': 1,
        'user.avatar': 1,
      },
    },
  ]);

  // console.log(users);
  return res
    .status(200)
    .json(new ApiResponse(200, users, 'Subcribers of the Channel'));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  //get Channel List
  const Channels = await SubscriptionModel.aggregate([
    {
      $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'channel',
        foreignField: '_id',
        as: 'channelInfo',
      },
    },
    { $unwind: '$channelInfo' },
    {
      $project: {
        'channelInfo._id': 1,
        'channelInfo.email': 1,
        'channelInfo.fullName': 1,
        'channelInfo.avatar': 1,
        'channelInfo.coverImage': 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, Channels, "User's Subscribed channels"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
