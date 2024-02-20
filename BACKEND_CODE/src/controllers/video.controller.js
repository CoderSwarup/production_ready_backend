import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';
import { Video } from '../models/video.model.js';
import {
  DeleteImageFromCloudinary,
  uploadFileOnCloudinary,
} from '../utils/CloudinaryServices.js';
import slugify from 'slugify';

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 2, query, sortBy, sortType } = req.query;
  // TODO: get all videos based on query, sort, pagination
  if (+page < 0) {
    page = 1;
  }
  let searchConditions = {};
  if (query) {
    searchConditions.$or = [
      { title: { $regex: query, $options: 'i' } },
      { slug: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ];
  }

  const sort = {};
  sort[sortBy] = sortType === 'asc' ? 1 : -1;

  const totalCount = await Video.countDocuments(searchConditions);

  // Calculate number of documents to skip
  const skip = (+page - 1) * +limit;

  // Fetch videos based on search conditions, pagination, and sorting
  const videoList = await Video.find(searchConditions)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('owner', 'fullName avatar');

  // Return paginated result
  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalCount,
        totalPages: Math.ceil(totalCount / +limit),
        currentPage: +page,
        videos: videoList,
      },
      'Successfully fetched the list of videos',
    ),
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, 'UnAuthorize');
  }

  if (!title || !description) {
    throw new ApiError(401, 'Title and description is Required');
  }

  //generate slug
  const slug = slugify(title);
  if (!slug) {
    throw new ApiError(401, 'Something Wrong Please Try Again');
  }

  //Upload video and thmbnail

  if (!req.files.videoFile) {
    throw new ApiError(401, 'Video File is Required');
  }
  if (!req.files.thumbnail) {
    throw new ApiError(401, ' Thumbnail is Required');
  }

  const VideoLocalFilePath = req?.files.videoFile[0]?.path;
  const thumbnailLocalPath = req?.files?.thumbnail[0]?.path;

  let UploadedVideoResponse;
  UploadedVideoResponse = await uploadFileOnCloudinary(VideoLocalFilePath);

  let thumbnailUplodedResponse;
  thumbnailUplodedResponse = await uploadFileOnCloudinary(thumbnailLocalPath);

  const SaveVideoDB = await Video({
    videoFile: {
      public_id: UploadedVideoResponse?.public_id,
      url: UploadedVideoResponse?.url,
    },
    thumbnail: {
      public_id: thumbnailUplodedResponse?.public_id,
      url: thumbnailUplodedResponse?.url,
    },
    title,
    slug,
    description,
    duration: UploadedVideoResponse?.duration,
    owner: userId,
  });

  const publishVideo = await SaveVideoDB.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { publishVideo }, 'Vido Publish Successfully'));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!videoId || videoId.length !== 24) {
    throw new ApiError(400, 'Video Not Found');
  }

  //find the Video is Present or not
  let video = await Video.findById(videoId).populate(
    'owner',
    'fullName avatar',
  );
  if (!video) {
    throw new ApiError(400, 'Video Not Found');
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        video: video,
      },
      'Video fetch Successfully',
    ),
  );
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
  const thumbnailLocalPath = req.file?.path; // This will be available if multer middleware is used

  const { title, description } = req.body;

  // Check if the video ID is valid
  if (!videoId || videoId.length !== 24) {
    throw new ApiError(400, 'Invalid Video ID');
  }

  // Find the video by its ID
  let video = await Video.findById(videoId);

  // Check if the video exists
  if (!video) {
    throw new ApiError(404, 'Video Not Found');
  }

  // Check if the user is authorized to update the video
  const userId = req.user._id;
  if (userId.toString() !== video.owner.toString()) {
    throw new ApiError(403, 'Unauthorized Access');
  }

  const updateFields = {};
  // Update the video details
  if (title) {
    updateFields.title = title;
    const slug = slugify(title);
    updateFields.slug = slug;
  }
  if (description) {
    updateFields.description = description;
  }

  if (thumbnailLocalPath) {
    // If thumbnail is provided, update the thumbnail URL

    // Destroy old Thumbnail
    const oldThumbnailId = video.thumbnail?.public_id;
    if (oldThumbnailId) {
      await DeleteImageFromCloudinary(oldThumbnailId);
    }

    // Upload new Thumbnail
    const UplodedThumbailResponse = await uploadFileOnCloudinary(
      thumbnailLocalPath,
    );
    updateFields.thumbnail = {
      public_id: UplodedThumbailResponse?.public_id,
      url: UplodedThumbailResponse?.url,
    };
  }

  // Update the video in the database
  await Video.findByIdAndUpdate(videoId, { $set: updateFields });

  // Fetch the updated video
  video = await Video.findById(videoId);

  // Return the updated video
  res
    .status(200)
    .json(new ApiResponse(200, { video }, 'Video Updated Successfully'));
});
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  const userId = req.user._id;

  if (!videoId || videoId.length !== 24) {
    throw new ApiError(400, 'Video Not Found');
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, 'Video Not Found');
  }
  if (userId.toString() != video.owner.toString()) {
    throw new ApiError(400, 'Unauthorized Access');
  }

  // Delete the video from the database
  await Video.findByIdAndDelete(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Video deleted successfully'));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId || videoId.length !== 24) {
    throw new ApiError(400, 'Video Not Found');
  }

  //find the Video is Present or not
  let video = await Video.findOne({
    $and: [{ _id: videoId }, { owner: userId }],
  });

  if (!video) {
    throw new ApiError(400, 'Video Not Found');
  }

  await Video.findByIdAndUpdate(videoId, {
    isPublished: !video.isPublished,
  });

  const updatedVideo = await Video.findById(videoId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { video: updatedVideo },
        'Video Publish Status Changed',
      ),
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
