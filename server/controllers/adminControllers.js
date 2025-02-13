import sendResponse from "../helper/sendResponse.helper.js";
import * as adminServices from "../services/adminServices.js";
import { ERROR } from "../constants/error.js";

const adminControllers = {};

// Get Total Users
adminControllers.getTotalUsers = async (req, res) => {
  try {
    const userId = req.user;
    return await adminServices.handleGetTotalUsers(userId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Get Total Posts
adminControllers.getTotalPosts = async (req, res) => {
  try {
    const userId = req.user;
    return await adminServices.handleGetTotalPosts(userId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Get Total Comments
adminControllers.getTotalComments = async (req, res) => {
  try {
    const userId = req.user;
    return await adminServices.handleGetTotalComments(userId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Get Total Assessments
adminControllers.getTotalAssessments = async (req, res) => {
  try {
    const userId = req.user;
    return await adminServices.handleGetTotalAssessments(userId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Get 5 Users Most Popular
adminControllers.getTopUsersMostPopular = async (req, res) => {
  try {
    const userId = req.user;
    return await adminServices.handleGetTopUsersMostPopular(userId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Get Admin Infomation
adminControllers.getAdminInfo = async (req, res) => {
  try {
    const userId = req.user;
    return await adminServices.handleGetAdminInfo(userId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Get User List
adminControllers.getUserList = async (req, res) => {
  try {
    const userId = req.user;
    return await adminServices.handleGetUserList(userId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Update User Profile
adminControllers.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user;
    const { userId: updateUserId } = req.params;

    const allowedUpdates = [
      "avatar",
      "username",
      "email",
      "displayName",
      "tag",
      "gender",
      "dob",
      "country",
      "tel",
    ];
    const updatedData = Object.keys(req.body);

    const isUpdateAllowed = updatedData.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isUpdateAllowed) {
      return sendResponse({
        res,
        status: 400,
        message: "Invalid fields in request",
      });
    }

    return await adminServices.handleUpdateUserProfile(
      userId,
      updateUserId,
      req.body,
      res
    );
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Banned User
adminControllers.bannedUser = async (req, res) => {
  try {
    const userId = req.user;
    const { bannedUserId } = req.body;
    return await adminServices.handleBannedUser(userId, bannedUserId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Get List Posts
adminControllers.getListPosts = async (req, res) => {
  try {
    const userId = req.user;
    return await adminServices.handleGetListPosts(userId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Update Post
adminControllers.updatePost = async (req, res) => {
  try {
    const userId = req.user;
    const { postId } = req.params;
    const allowedUpdates = ["content", "media"];

    const updatedData = Object.keys(req.body);

    const isUpdateAllowed = updatedData.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isUpdateAllowed) {
      return sendResponse({
        res,
        status: 400,
        message: "Invalid fields in request",
      });
    }
    return await adminServices.handleUpdatePost(
      userId,
      postId,
      req.body,
      res
    );
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};
// Get List Report Posts
adminControllers.getListReportPosts = async (req, res) => {
  try {
    const userId = req.user;
    return await adminServices.handleGetListReportPosts(userId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Delete Report Post
adminControllers.deleteReportPost = async (req, res) => {
  try {
    const userId = req.user;
    const postId = req.params.postId;

    return await adminServices.handleDeleteReportPost(userId, postId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

// Get List Assessments
adminControllers.getListAssessments = async (req, res) => {
  try {
    const userId = req.user;
    return await adminServices.handleGetListAssessments(userId, res);
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};
export default adminControllers;
