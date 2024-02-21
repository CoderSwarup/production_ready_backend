import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';
import { Playlist } from '../models/playlist.model.js';
import UserModel from '../models/user.model.js';
import mongoose from 'mongoose';
import { Video } from '../models/video.model.js';
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const userId = req?.user?._id;
  //TODO: create playlist
  if (
    !name ||
    name?.trim() === '' ||
    !description ||
    description?.trim() === ''
  ) {
    throw new ApiError(400, 'Name or Description cannot be empty');
  }

  const NewPlaylist = await Playlist({
    name,
    description,
    owner: userId,
  });

  await NewPlaylist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, NewPlaylist, 'New PlayList is Created'));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user playlists

  if (!userId || userId.length != 24) {
    throw new ApiError(400, 'Invalid user Id');
  }

  const isUserPresent = await UserModel.findById(userId);

  if (!isUserPresent) {
    throw new ApiError(400, 'No Playlist Available');
  }

  const Playlists = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(isUserPresent._id),
      },
    },
    {
      $lookup: {
        from: 'videos', // Note: collection name should be lowercase and singular
        localField: 'videos',
        foreignField: '_id',
        as: 'videos',
      },
    },
  ]);

  res.status(200).json(new ApiResponse(200, { Playlists }, 'Users Playlists '));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!playlistId || playlistId.length != 24) {
    throw new ApiError(400, 'Plalist Not Available');
  }

  const playlist = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: 'videos', // Note: collection name should be lowercase and singular
        localField: 'videos',
        foreignField: '_id',
        as: 'videos',
      },
    },
  ]);

  if (!playlist) {
    throw new ApiError(400, 'Plalist Not Available');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, 'Playlist Get Successfully'));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user?._id;

  if (!playlistId || !videoId) {
    throw new ApiError(400, 'All Fields Are Required');
  }

  const isPlaylistPresent = await Playlist.findById(playlistId);

  if (!isPlaylistPresent) {
    throw new ApiError(400, 'Playlist is Not Present');
  }
  if (isPlaylistPresent.owner.toString() !== userId.toString()) {
    throw new ApiError(400, 'UnAuthorise Playlist Access');
  }

  const isVideoPresent = await Video.findById(videoId);
  if (!isVideoPresent) {
    throw new ApiError(400, 'Video is Not Present');
  }

  //add new Video in The plalist
  // if video already exists in playlist
  if (isPlaylistPresent?.videos.includes(videoId)) {
    throw new ApiError(400, 'video already exists in this playlist!!');
  }

  const AddVideoInPlayList = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $push: {
        videos: videoId,
      },
    },
    {
      new: true,
    },
  );
  await AddVideoInPlayList.save();
  if (!AddVideoInPlayList) {
    throw new ApiError(
      500,
      'something went wrong while added video to playlist !!',
    );
  }

  // return responce
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        AddVideoInPlayList,
        ' added video in playlist successfully!!',
      ),
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const userId = req.user?._id;
  // TODO: remove video from playlist
  if (!playlistId || !videoId) {
    throw new ApiError(400, 'All Fields Are Required');
  }

  const isPlaylistPresent = await Playlist.findById(playlistId);

  if (!isPlaylistPresent) {
    throw new ApiError(400, 'Playlist is Not Present');
  }
  if (isPlaylistPresent.owner.toString() !== userId.toString()) {
    throw new ApiError(400, 'UnAuthorise Playlist Access');
  }

  const isVideoPresent = await Video.findById(videoId);
  if (!isVideoPresent) {
    throw new ApiError(400, 'Video is Not Present');
  }
  if (!isPlaylistPresent?.videos.includes(videoId)) {
    throw new ApiError(400, 'video Not exists in this playlist!!');
  }

  const removePlaylistVideo = await Playlist.findByIdAndUpdate(playlistId, {
    $pull: {
      videos: videoId,
    },
  });

  await removePlaylistVideo.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        {},
        ' Video Remove From The playlist successfully!!',
      ),
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
  const userId = req.user?._id;
  if (!playlistId) {
    throw new ApiError(400, 'All Fields Are Required');
  }

  const isPlaylistPresent = await Playlist.findById(playlistId);

  if (!isPlaylistPresent) {
    throw new ApiError(400, 'Playlist is Not Present');
  }
  if (isPlaylistPresent.owner.toString() !== userId.toString()) {
    throw new ApiError(400, 'UnAuthorise Playlist Access');
  }

  await Playlist.findByIdAndDelete(playlistId);

  return res
    .status(201)
    .json(new ApiResponse(200, {}, 'playlist Remove successfully!!'));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  //TODO: update playlist
  const userId = req.user?._id;

  if (
    !name ||
    name?.trim() === '' ||
    !description ||
    description?.trim() === ''
  ) {
    throw new ApiError(400, 'Name or Description cannot be empty');
  }
  if (!playlistId || playlistId.length != 24) {
    throw new ApiError(400, 'Invalid Playlist');
  }

  const isPlaylistPresent = await Playlist.findById(playlistId);

  if (!isPlaylistPresent) {
    throw new ApiError(400, 'Playlist is Not Present');
  }
  if (isPlaylistPresent.owner.toString() !== userId.toString()) {
    throw new ApiError(400, 'UnAuthorise Playlist Access');
  }

  const playlist = await Playlist.findByIdAndUpdate(playlistId, {
    $set: {
      name: name || isPlaylistPresent.name,
      description: description || isPlaylistPresent.description,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { playlist }, 'Playlist Updated Successfully'));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
