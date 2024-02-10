import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResoponse.js';
import { Video } from '../models/video.model.js';
import { Comment } from '../models/comment.model.js';

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  if (!videoId || videoId < 24 || videoId > 24)
    throw new ApiError(400, 'Please provide the video id');

  // Find comments for the specified video using pagination
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 }, // Sort comments by creation date in descending order
    populate: {
      path: 'owner', // Populate the 'owner' field
      select: 'username fullName avatar', // Select specific fields to populate
    },
  };

  const comments = await Comment.aggregatePaginate({ video: videoId }, options);
  return res
    .status(200)
    .json(new ApiResponse(200, comments, 'Commet of the Specified video'));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { content } = req.body;
  const { videoId } = req.params;
  const userid = req.user?._id;
  console.log(req.body);
  if (!content || content == '') {
    throw new ApiError(400, 'all Fields Required');
  }
  // Check if the Video is Prsent or not
  const isVideoExists = await Video.findById(videoId);

  if (!isVideoExists) {
    throw new ApiError(404, 'Video Not Found');
  }
  const newComment = await Comment({
    content,
    video: videoId,
    owner: userid,
  });

  const comment = await newComment.save();

  return res.status(200).json(new ApiResponse(200, comment, 'Commet is Added'));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { commentId } = req.params;
  const { content } = req.body;
  const userid = req.user?.id;

  if ((content == '') | !content) {
    throw new ApiError(200, 'Comment content Should not Be Empty');
  }

  // check comment is exist or not
  const isCommentExist = await Comment.findOne({
    _id: commentId,
    owner: userid,
  });

  if (!isCommentExist) {
    throw new ApiError(400, "You Don't Have Access To Update This Comment");
  }

  isCommentExist.content = content;

  const UpdatedComment = await isCommentExist.save();

  return res
    .status(200)
    .json(new ApiResponse(200, UpdatedComment, 'Comment Update Successfully'));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;
  const userid = req.user?._id;

  // check the comment is Present or Not
  const isCommentExist = await Comment.findOne({
    _id: commentId,
    owner: userid,
  });

  if (!isCommentExist) {
    throw new ApiError(400, "You Don't Have Access To Delete This Comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, 'Comment Delete Successfully'));
});

export { getVideoComments, addComment, updateComment, deleteComment };
