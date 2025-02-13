import sendResponse from "../helper/sendResponse.helper.js";
import { ERROR } from "../constants/error.js";
import { User } from "../models/UserSchemas.js";
import { Post } from "../models/PostSchemas.js";
import { Comment } from "../models/CommentSchemas.js";
import { Assessment } from "../models/AssessmentSchemas.js";

const handleGetTotalUsers = async (userId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 403,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const totalUser = await User.countDocuments({ isAdmin: false });

    return sendResponse({
      res,
      status: 200,
      color: "#00FF7F",
      title: "Total Users",
      number: JSON.stringify(totalUser),
      dataKey: "users",
      percentage: 45,
      chartData: [
        {
          name: "Sun",
          users: 200,
        },
        {
          name: "Mon",
          users: 400,
        },
        {
          name: "Tue",
          users: 100,
        },
        {
          name: "Wed",
          users: 800,
        },
        {
          name: "Thu",
          users: 300,
        },
        {
          name: "Fri",
          users: 900,
        },
        {
          name: "Sat",
          users: 1000,
        },
      ],
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

const handleGetTotalPosts = async (userId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 403,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const totalPosts = await Post.countDocuments();

    return sendResponse({
      res,
      status: 200,
      color: "#00FF7F",
      title: "Total Posts",
      number: JSON.stringify(totalPosts),
      dataKey: "posts",
      percentage: 60,
      chartData: [
        {
          name: "Sun",
          posts: 100,
        },
        {
          name: "Mon",
          posts: 200,
        },
        {
          name: "Tue",
          posts: 300,
        },
        {
          name: "Wed",
          posts: 250,
        },
        {
          name: "Thu",
          posts: 500,
        },
        {
          name: "Fri",
          posts: 550,
        },
        {
          name: "Sat",
          posts: 600,
        },
      ],
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

const handleGetTotalComments = async (userId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 403,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const totalComments = await Comment.countDocuments();

    return sendResponse({
      res,
      status: 200,
      color: "#00FF7F",
      title: "Total Comments",
      number: JSON.stringify(totalComments),
      dataKey: "comments",
      percentage: 75,
      chartData: [
        {
          name: "Sun",
          comments: 50,
        },
        {
          name: "Mon",
          comments: 80,
        },
        {
          name: "Tue",
          comments: 100,
        },
        {
          name: "Wed",
          comments: 20,
        },
        {
          name: "Thu",
          comments: 65,
        },
        {
          name: "Fri",
          comments: 70,
        },
        {
          name: "Sat",
          comments: 75,
        },
      ],
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

const handleGetTotalAssessments = async (userId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 403,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const totalAssessments = await Assessment.countDocuments();

    return sendResponse({
      res,
      status: 200,
      color: "#00FF7F",
      title: "Total Assessments",
      number: JSON.stringify(totalAssessments),
      dataKey: "assessments",
      percentage: 0,
      chartData: [
        {
          name: "Sun",
          assessments: 0,
        },
        {
          name: "Mon",
          assessments: 0,
        },
        {
          name: "Tue",
          assessments: 0,
        },
        {
          name: "Wed",
          assessments: 0,
        },
        {
          name: "Thu",
          assessments: 0,
        },
        {
          name: "Fri",
          assessments: 0,
        },
        {
          name: "Sat",
          assessments: 0,
        },
      ],
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

const handleGetTopUsersMostPopular = async (userId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 403,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const topUsers = await Post.aggregate([
      {
        $match: { isDeleted: false, isArchived: false },
      },
      {
        $group: {
          _id: "$createdBy",
          totalLikes: { $sum: { $size: "$likes" } },
        },
      },
      {
        $sort: { totalLikes: -1 },
      },
      {
        $limit: 6,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          id: "$user._id",
          email: "$user.email",
          username: "$user.username",
          displayName: "$user.displayName",
          img: "$user.avatar",
          totalLikes: 1,
        },
      },
    ]);

    return sendResponse({
      res,
      status: 200,
      topUsers,
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

const handleGetAdminInfo = async (userId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 403,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }
    return sendResponse({
      res,
      status: 200,
      id: checkUser._id,
      email: checkUser.email,
      username: checkUser.username,
      displayName: checkUser.displayName,
      img: checkUser.avatar,
      role: "Super Admin",
      tel: checkUser.tel,
      tag: checkUser.tag,
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

const handleGetUserList = async (userId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const userList = await User.find({ isAdmin: false }).select(
      "email username displayName avatar tel dob gender tag isBanned createdAt"
    );

    const userListProcessed = userList.map((user, index) => ({
      ...user.toObject(),
      id: index + 1,
      createdAt: new Date(user.createdAt).toLocaleDateString("en-GB"),
    }));

    return sendResponse({
      res,
      status: 200,
      userListProcessed,
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

const handleUpdateUserProfile = async (
  userId,
  updateUserId,
  updatedData,
  res
) => {
  console.log("🚀 ~ updatedData:", updatedData);
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const user = await User.findById(updateUserId);

    if (!user) {
      return sendResponse({
        res,
        status: 404,
        message: "User not found",
        errorCode: ERROR.USER_NOT_FOUND,
      });
    }

    const existingUsernameAndTag = await User.findOne({
      displayName: updatedData.displayName || checkUser.displayName,
      tag: updatedData.tag || checkUser.tag,
      _id: { $ne: updateUserId },
    });

    if (existingUsernameAndTag) {
      return sendResponse({
        res,
        status: 400,
        message: "Display name or tag already exists",
        errorCode: ERROR.NAME_TAG_EXIST,
      });
    }

    Object.keys(updatedData).forEach((update) => {
      user[update] = updatedData[update];
    });

    await user.save();

    return sendResponse({
      res,
      status: 200,
      message: "User profile has been updated",
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

const handleBannedUser = async (userId, bannedUserId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const bannedUser = await User.findById(bannedUserId);

    if (!bannedUser) {
      return sendResponse({
        res,
        status: 404,
        message: "User not found",
        errorCode: ERROR.USER_NOT_FOUND,
      });
    }

    bannedUser.isBanned = !bannedUser.isBanned;

    await bannedUser.save();

    return sendResponse({
      res,
      status: 200,
      message: bannedUser.isBanned
        ? "User has been banned"
        : "User has been unbanned",
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

const handleGetListPosts = async (userId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const posts = await Post.find({ isDeleted: false, isArchived: false })
      .populate("createdBy", "avatar username")
      .select("title content media createdBy createdAt likes comments")
      .sort({ createdAt: -1 });

    const listPostsProcessed = posts.map((post, index) => ({
      id: index + 1,
      postId: post._id,
      title: post.title,
      content: post.content,
      media: post.media,
      createdBy: post.createdBy,
      likes: post.likes.length,
      comments: post.comments.length,
      date: new Date(post.createdAt).toLocaleDateString("en-GB"),
    }));

    return sendResponse({
      res,
      status: 200,
      listPostsProcessed,
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

    if (!checkUser || !checkUser.isAdmin) {
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

    Object.keys(updatedData).forEach((update) => {
      post[update] = updatedData[update];
    });

    await post.save();

    return sendResponse({
      res,
      status: 200,
      message: "Post has been updated",
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
const handleGetListReportPosts = async (userId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const reportedPosts = await Post.find({
      "reports.0": { $exists: true },
      isDeleted: false,
    })
      .populate("reports.createdBy", "avatar username")
      .select("title content createdBy createdAt reports likes comments");

    const listReportPostsProcessed = reportedPosts.flatMap((post) =>
      post.reports.map((report, index) => ({
        id: index + 1,
        postId: post._id,
        postTitle: post.title,
        content: post.content,
        likes: post.likes.length,
        comments: post.comments.length,
        reportedBy: report.createdBy,
        reason: report.reason,
        date: new Date(report.createdAt).toLocaleDateString("en-GB"),
      }))
    );

    const listWithUniqueIds = listReportPostsProcessed.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    return sendResponse({
      res,
      status: 200,
      listWithUniqueIds,
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

const handleDeleteReportPost = async (userId, postId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const post = await Post.findById(postId);

    if (!post || post.isDeleted) {
      return sendResponse({
        res,
        status: 404,
        message: "Post not found",
        errorCode: ERROR.POST_NOT_FOUND,
      });
    }

    post.isDeleted = true;

    await post.save();

    return sendResponse({
      res,
      status: 200,
      message: "Post has been deleted",
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

const handleGetListAssessments = async (userId, res) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || !checkUser.isAdmin) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const assessments = await Assessment.find().populate(
      "createdBy",
      "avatar username"
    );

    const listAssessmentsProcessed = assessments.map((assessment, index) => ({
      id: index + 1,
      assessmentId: assessment._id,
      content: assessment.content,
      createdBy: assessment.createdBy,
      star: assessment.star,
      date: new Date(assessment.createdAt).toLocaleDateString("en-GB"),
    }));

    return sendResponse({
      res,
      status: 200,
      listAssessmentsProcessed,
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
  handleGetTotalUsers,
  handleGetTotalPosts,
  handleGetTotalComments,
  handleGetTotalAssessments,
  handleGetTopUsersMostPopular,
  handleGetAdminInfo,
  handleGetUserList,
  handleBannedUser,
  handleGetListPosts,
  handleUpdatePost,
  handleGetListReportPosts,
  handleDeleteReportPost,
  handleGetListAssessments,
  handleUpdateUserProfile,
};
