import { User } from "../models/UserSchemas.js";
import { Post } from "../models/PostSchemas.js";
import { Comment } from "../models/CommentSchemas.js";
import { Assessment } from "../models/AssessmentSchemas.js";
import sendResponse from "../helper/sendResponse.helper.js";
import { sendNotification } from "../sockets/socketHandler.js";
import { ERROR } from "../constants/error.js";

const handleCreatePost = async (userId, content, media, privacy, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    if (media.length > 5) {
      return sendResponse({
        res,
        status: 400,
        message: "Media maximum limit is 5",
        errorCode: ERROR.MEDIA_MAX_LIMIT,
      });
    }

    if (content === "") {
      return sendResponse({
        res,
        status: 400,
        message: "Content is required",
        errorCode: ERROR.CONTENT_REQUIRED,
      });
    }
    const videoCount = media.filter((item) => item.type === "video").length;

    if (videoCount > 2) {
      return sendResponse({
        res,
        status: 400,
        message: "Video maximum limit is 2",
        errorCode: ERROR.VIDEO_MAX_LIMIT,
      });
    }

    const post = await Post.create({
      createdBy: userId,
      content,
      media,
      privacy,
    });

    const resPost = {
      _id: post._id,
      content: post.content,
      media: post.media,
      privacy: post.privacy,
      likes: post.likes.length,
      shares: post.shares.length,
      comments: post.comments.length,
      isLiked: false,
      isShared: false,
      createdBy: {
        _id: checkUser._id,
        displayName: checkUser.displayName,
        avatar: checkUser.avatar,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return sendResponse({
      res,
      status: 200,
      message: "Post created successfully",
      data: resPost,
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleCommentPost = async (userId, postId, content, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return sendResponse({
        res,
        status: 404,
        message: "Post not found",
        errorCode: ERROR.POST_NOT_FOUND,
      });
    }

    const comment = await Comment.create({
      createdBy: userId,
      content,
    });

    post.comments.push(comment);
    await post.save();

    if (post.createdBy != userId) {
      await sendNotification(userId, post.createdBy, "comment", postId);
    }

    const resComment = {
      _id: comment._id,
      content: comment.content,
      createdBy: {
        _id: checkUser._id,
        displayName: checkUser.displayName,
        avatar: checkUser.avatar,
      },
      replies: comment.replies.length,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };

    return sendResponse({
      res,
      status: 200,
      message: "Comment created successfully",
      data: resComment,
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleInteractPost = async (userId, postId, isLike, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return sendResponse({
        res,
        status: 404,
        message: "Post not found",
        errorCode: ERROR.POST_NOT_FOUND,
      });
    }

    if (isLike) {
      if (post.likes.includes(userId)) {
        return sendResponse({
          res,
          status: 400,
          message: "You have already liked this post",
          errorCode: ERROR.LIKE_POST_ALREADY,
        });
      }

      post.likes.push(userId);

      if (post.createdBy != userId) {
        await sendNotification(userId, post.createdBy, "like", postId);
      }
    } else {
      if (!post.likes.includes(userId)) {
        return sendResponse({
          res,
          status: 400,
          message: "You have not liked this post",
          errorCode: ERROR.NOT_LIKE_POST_EXIST,
        });
      }
      post.likes.pop(userId);
    }

    await post.save();

    const resPost = {
      _id: post._id,
      content: post.content,
      media: post.media,
      privacy: post.privacy,
      likes: post.likes.length,
      shares: post.shares.length,
      comments: post.comments.length,
      isLiked: post.likes.some((like) => like.toString() === userId),
      isShared: post.shares.some((like) => like.toString() === userId),
      createdBy: {
        _id: checkUser._id,
        displayName: checkUser.displayName,
        avatar: checkUser.avatar,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return sendResponse({
      res,
      status: 200,
      message: isLike ? "Post liked successfully" : "Post unliked successfully",
      data: resPost,
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleSharePost = async (userId, postId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return sendResponse({
        res,
        status: 404,
        message: "Post not found",
        errorCode: ERROR.POST_NOT_FOUND,
      });
    }

    if (post.createdBy == userId) {
      return sendResponse({
        res,
        status: 400,
        message: "You can not share your own post",
        errorCode: ERROR.SHARE_OWN_POST,
      });
    }

    if (post.shares.includes(userId)) {
      return sendResponse({
        res,
        status: 400,
        message: "You have already shared this post",
        errorCode: ERROR.SHARE_POST_ALREADY,
      });
    }

    post.shares.push(userId);
    await post.save();

    if (post.createdBy != userId) {
      await sendNotification(userId, post.createdBy, "share", postId);
    }

    const resPost = {
      _id: post._id,
      content: post.content,
      media: post.media,
      privacy: post.privacy,
      likes: post.likes.length,
      shares: post.shares.length,
      comments: post.comments.length,
      isLiked: post.likes.some((like) => like.toString() === userId),
      isShared: post.shares.some((like) => like.toString() === userId),
      createdBy: {
        _id: checkUser._id,
        displayName: checkUser.displayName,
        avatar: checkUser.avatar,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return sendResponse({
      res,
      status: 200,
      message: "Post shared successfully",
      data: resPost,
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleReplyComment = async (userId, commentId, content, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return sendResponse({
        res,
        status: 404,
        message: "Comment not found",
        errorCode: ERROR.COMMENT_NOT_FOUND,
      });
    }

    const post = await Post.findOne({
      comments: { $in: [commentId] },
      isDeleted: false,
      isArchived: false,
    });

    if (!post) {
      return sendResponse({
        res,
        status: 404,
        message: "Post not found",
        errorCode: ERROR.POST_NOT_FOUND,
      });
    }

    if (
      ((post.privacy === "friends" &&
        !checkUser.friends.includes(post.createdBy)) ||
        post.privacy === "private") &&
      post.createdBy != userId
    ) {
      return sendResponse({
        res,
        status: 401,
        message: "You are not authorized to reply this comment",
        errorCode: ERROR.COMMENT_REPLY_UNAUTHORIZED,
      });
    }

    comment.replies.push({ createdBy: userId, content });

    comment.save();

    if (comment.createdBy != userId) {
      await sendNotification(
        userId,
        comment.createdBy,
        "replyComment",
        post._id
      );
    }

    const reply = comment.replies[comment.replies.length - 1];

    const resReply = {
      _id: reply._id,
      content: reply.content,
      createdBy: {
        _id: checkUser._id,
        displayName: checkUser.displayName,
        avatar: checkUser.avatar,
      },
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
    };

    return sendResponse({
      res,
      status: 200,
      message: "Reply comment successfully",
      data: resReply,
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleArchivePost = async (userId, postId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return sendResponse({
        res,
        status: 404,
        message: "Post not found",
        errorCode: ERROR.POST_NOT_FOUND,
      });
    }

    if (post.createdBy != userId || checkUser.isAdmin == false) {
      return sendResponse({
        res,
        status: 401,
        message: "You are not authorized to archive this post",
        errorCode: ERROR.POST_ARCHIVE_UNAUTHORIZED,
      });
    }

    post.isArchived = !post.isArchived;
    await post.save();

    return sendResponse({
      res,
      status: 200,
      message: post.isArchived
        ? "Post archived successfully"
        : "Post unarchived successfully",
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleDeletePost = async (userId, postId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return sendResponse({
        res,
        status: 404,
        message: "Post not found",
        errorCode: ERROR.POST_NOT_FOUND,
      });
    }

    if (post.createdBy != userId) {
      return sendResponse({
        res,
        status: 401,
        message: "You are not authorized to delete this post",
        errorCode: ERROR.POST_DELETE_UNAUTHORIZED,
      });
    }

    post.isDeleted = true;
    await post.save();

    return sendResponse({
      res,
      status: 200,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleUpdatePost = async (userId, postId, updatedData, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const post = await Post.findById(postId).where("isDeleted").equals(false);

    if (!post) {
      return sendResponse({
        res,
        status: 404,
        message: "Post not found",
        errorCode: ERROR.POST_NOT_FOUND,
      });
    }

    if (post.createdBy != userId) {
      return sendResponse({
        res,
        status: 401,
        message: "You are not authorized to update this post",
        errorCode: ERROR.POST_UPDATE_UNAUTHORIZED,
      });
    }

    Object.keys(updatedData).forEach((update) => {
      post[update] = updatedData[update];
    });

    await post.save();

    const resPost = {
      _id: post._id,
      content: post.content,
      media: post.media,
      privacy: post.privacy,
      likes: post.likes.length,
      shares: post.shares.length,
      comments: post.comments.length,
      isLiked: post.likes.some((like) => like.toString() === userId),
      isShared: post.shares.some((like) => like.toString() === userId),
      createdBy: {
        _id: checkUser._id,
        displayName: checkUser.displayName,
        avatar: checkUser.avatar,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return sendResponse({
      res,
      status: 200,
      message: "Post updated successfully",
      data: resPost,
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleUpdateComment = async (userId, commentId, updatedData, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return sendResponse({
        res,
        status: 404,
        message: "Comment not found",
        errorCode: ERROR.COMMENT_NOT_FOUND,
      });
    }

    if (comment.createdBy != userId) {
      return sendResponse({
        res,
        status: 401,
        message: "You are not authorized to update this comment",
        errorCode: ERROR.COMMENT_UPDATE_UNAUTHORIZED,
      });
    }

    Object.keys(updatedData).forEach((update) => {
      comment[update] = updatedData[update];
    });

    await comment.save();

    const resComment = {
      _id: comment._id,
      content: comment.content,
      createdBy: {
        _id: checkUser._id,
        displayName: checkUser.displayName,
        avatar: checkUser.avatar,
      },
      replies: comment.replies.length,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };

    return sendResponse({
      res,
      status: 200,
      message: "Comment updated successfully",
      data: resComment,
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleUpdateReply = async (
  userId,
  commentId,
  replyId,
  updatedData,
  res
) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return sendResponse({
        res,
        status: 404,
        message: "Comment not found",
        errorCode: ERROR.COMMENT_NOT_FOUND,
      });
    }

    const reply = comment.replies.id(replyId);

    if (!reply) {
      return sendResponse({
        res,
        status: 404,
        message: "Reply not found",
        errorCode: ERROR.REPLY_NOT_FOUND,
      });
    }

    if (reply.createdBy != userId) {
      return sendResponse({
        res,
        status: 401,
        message: "You are not authorized to update this reply",
        errorCode: ERROR.REPLY_UPDATE_UNAUTHORIZED,
      });
    }

    Object.keys(updatedData).forEach((update) => {
      reply[update] = updatedData[update];
    });

    await comment.save();

    const replied = comment.replies.id(replyId);

    const resReply = {
      _id: replied._id,
      content: replied.content,
      createdBy: {
        _id: checkUser._id,
        displayName: checkUser.displayName,
        avatar: checkUser.avatar,
      },
      createdAt: replied.createdAt,
      updatedAt: replied.updatedAt,
    };

    return sendResponse({
      res,
      status: 200,
      message: "Reply updated successfully",
      data: resReply,
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleGetUserListPosts = async (userId, cursor, limit, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const query = { createdBy: userId, isDeleted: false, isArchived: false };

    if (cursor) {
      query["_id"] = { $lt: cursor };
    }
    const posts = await Post.find(query)
      .populate({
        path: "createdBy",
        select: "displayName avatar",
      })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const processedPosts = posts.map((post) => ({
      ...post,
      likes: post.likes.length,
      shares: post.shares.length,
      comments: post.comments.length,
      isLiked: post.likes.some((like) => like.toString() === userId),
      isShared: post.shares.some((like) => like.toString() === userId),
    }));

    const nextCursor =
      posts.length == limit ? posts[posts.length - 1]._id : null;

    return sendResponse({
      res,
      status: 200,
      data: {
        posts: processedPosts,
        nextCursor,
      },
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleGetUserListArchivedPosts = async (userId, cursor, limit, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const query = { createdBy: userId, isDeleted: false, isArchived: true };

    if (cursor) {
      query["_id"] = { $lt: cursor };
    }

    const posts = await Post.find(query)
      .populate({ path: "createdBy", select: "displayName avatar" })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const processedPosts = posts.map((post) => ({
      ...post,
      likes: post.likes.length,
      shares: post.shares.length,
      comments: post.comments.length,
      isLiked: post.likes.some((like) => like.toString() === userId),
      isShared: post.shares.some((like) => like.toString() === userId),
    }));

    const nextCursor =
      posts.length == limit ? posts[posts.length - 1]._id : null;

    return sendResponse({
      res,
      status: 200,
      data: {
        posts: processedPosts,
        nextCursor,
      },
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleGetAllPosts = async (userId, cursor, limit, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const userFriends = checkUser.friends;

    const query = {
      isDeleted: false,
      isArchived: false,
      $or: [
        { privacy: "public" },
        {
          privacy: "friends",
          createdBy: { $in: userFriends },
        },
      ],
    };

    if (cursor) {
      query["_id"] = { $lt: cursor };
    }

    const posts = await Post.find(query)
      .select("-__v -reports -isDeleted -isArchived")
      .populate({
        path: "createdBy",
        select: "displayName avatar",
      })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const processedPosts = posts.map((post) => {
      return {
        ...post,
        likes: post.likes.length,
        shares: post.shares.length,
        comments: post.comments.length,
        isLiked: post.likes.some((like) => like.toString() === userId),
        isShared: post.shares.some((like) => like.toString() === userId),
      };
    });

    const nextCursor =
      posts.length == limit ? posts[posts.length - 1]._id : null;

    return sendResponse({
      res,
      status: 200,
      data: {
        posts: processedPosts,
        nextCursor,
      },
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleGetPostComments = async (userId, postId, cursor, limit, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const post = await Post.findById(postId).where("isDeleted").equals(false);

    if (!post) {
      return sendResponse({
        res,
        status: 404,
        message: "Post not found",
        errorCode: ERROR.POST_NOT_FOUND,
      });
    }

    const query = {};

    if (cursor) {
      query["_id"] = { $lt: cursor };
    }

    const comments = await Comment.find({
      _id: { $in: post.comments },
      ...query,
    })
      .populate({ path: "createdBy", select: "displayName avatar" })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const processedComments = comments.map((comment) => {
      return {
        ...comment,
        replies: comment.replies.length,
      };
    });

    const nextCursor =
      processedComments.length == limit
        ? processedComments[processedComments.length - 1]._id
        : null;

    return sendResponse({
      res,
      status: 200,
      data: {
        processedComments,
        nextCursor,
      },
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleGetCommentReplies = async (
  userId,
  commentId,
  cursor,
  limit,
  res
) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const comment = await Comment.findById(commentId).populate({
      path: "replies.createdBy",
      select: "displayName avatar",
    });

    if (!comment) {
      return sendResponse({
        res,
        status: 404,
        message: "Comment not found",
        errorCode: ERROR.COMMENT_NOT_FOUND,
      });
    }

    const replies = comment.replies || [];
    let paginatedReplies;

    replies.sort((a, b) => b.createdAt - a.createdAt);

    if (cursor) {
      const cursorIndex = replies.findIndex(
        (reply) => reply._id.toString() === cursor
      );

      if (cursorIndex === -1) {
        return sendResponse({
          res,
          status: 404,
          message: "Invalid cursor",
          errorCode: ERROR.INVALID_CURSOR,
        });
      }

      paginatedReplies = replies.slice(
        cursorIndex + 1,
        cursorIndex + 1 + limit
      );
    } else {
      paginatedReplies = replies.slice(0, limit);
    }

    // Lấy cursor tiếp theo nếu còn dữ liệu
    const nextCursor =
      paginatedReplies.length > 0
        ? paginatedReplies[paginatedReplies.length - 1]._id.toString()
        : null;

    return sendResponse({
      res,
      status: 200,
      message: "Replies fetched successfully",
      data: {
        replies: paginatedReplies,
        nextCursor,
      },
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleGetMyAllPostsShared = async (userId, cursor, limit, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const query = {
      shares: userId,
      isDeleted: false,
      isArchived: false,
      privacy: "public",
    };

    if (cursor) {
      query["_id"] = { $lt: cursor };
    }

    const posts = await Post.find(query)
      .select("-__v -reports -isDeleted -isArchived")
      .populate({
        path: "createdBy",
        select: "displayName avatar",
      })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const processedPosts = posts.map((post) => ({
      ...post,
      likes: post.likes.length,
      shares: post.shares.length,
      comments: post.comments.length,
      isLiked: post.likes.some((like) => like.toString() === userId),
      isShared: post.shares.some((like) => like.toString() === userId),
    }));

    const nextCursor =
      posts.length == limit ? posts[posts.length - 1]._id : null;

    return sendResponse({
      res,
      status: 200,
      data: {
        posts: processedPosts,
        nextCursor,
      },
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleGetUserAllPostsSharing = async (
  userId,
  currentUserId,
  cursor,
  limit,
  res
) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const checkCurrentUser = await User.findById(currentUserId);

    if (!checkCurrentUser || checkCurrentUser.isBanned) {
      return sendResponse({
        res,
        status: 404,
        message: "User not found",
        errorCode: ERROR.USER_NOT_FOUND,
      });
    }

    const query = {
      shares: currentUserId,
      isDeleted: false,
      isArchived: false,
      privacy: "public",
    };

    if (cursor) {
      query["_id"] = { $lt: cursor };
    }

    const posts = await Post.find(query)
      .select("-__v -reports -isDeleted -isArchived")
      .populate({
        path: "createdBy",
        select: "displayName avatar",
      })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const processedPosts = posts.map((post) => ({
      ...post,
      likes: post.likes.length,
      shares: post.shares.length,
      comments: post.comments.length,
      isLiked: post.likes.some((like) => like.toString() === userId),
      isShared: post.shares.some((like) => like.toString() === userId),
    }));

    const nextCursor =
      posts.length == limit ? posts[posts.length - 1]._id : null;

    return sendResponse({
      res,
      status: 200,
      data: {
        posts: processedPosts,
        nextCursor,
      },
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleReportPost = async (userId, postId, reason, res) => {
  try {
    if (reason === "") {
      return sendResponse({
        res,
        status: 400,
        message: "Reason is required",
        errorCode: ERROR.REASON_REQUIRED,
      });
    }

    if (postId === "") {
      return sendResponse({
        res,
        status: 400,
        message: "Post id is required",
        errorCode: ERROR.POST_ID_REQUIRED,
      });
    }

    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return sendResponse({
        res,
        status: 404,
        message: "Post not found",
        errorCode: ERROR.POST_NOT_FOUND,
      });
    }

    if (post.createdBy == userId) {
      return sendResponse({
        res,
        status: 400,
        message: "You can not report your own post",
        errorCode: ERROR.REPORT_OWN_POST,
      });
    }

    post.reports.push({ createdBy: userId, reason });

    await post.save();

    return sendResponse({
      res,
      status: 200,
      message: "Post reported successfully",
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleCreateAssessment = async (userId, content, star, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    if (content === "") {
      return sendResponse({
        res,
        status: 400,
        message: "Content is required",
        errorCode: ERROR.CONTENT_REQUIRED,
      });
    }

    if (star < 1 || star > 5) {
      return sendResponse({
        res,
        status: 400,
        message: "Star must be between 1 and 5",
        errorCode: ERROR.STAR_INVALID,
      });
    }

    const assessment = await Assessment.create({
      createdBy: userId,
      content,
      star,
    });

    return sendResponse({
      res,
      status: 200,
      message: "Assessment created successfully",
      data: assessment,
    });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};
export {
  handleCreatePost,
  handleCommentPost,
  handleInteractPost,
  handleSharePost,
  handleReplyComment,
  handleArchivePost,
  handleDeletePost,
  handleUpdatePost,
  handleUpdateComment,
  handleUpdateReply,
  handleGetUserListPosts,
  handleGetUserListArchivedPosts,
  handleGetAllPosts,
  handleGetPostComments,
  handleGetCommentReplies,
  handleGetMyAllPostsShared,
  handleGetUserAllPostsSharing,
  handleReportPost,
  handleCreateAssessment
};
