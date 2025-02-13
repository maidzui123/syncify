import { User } from "../models/UserSchemas.js";
import FriendRequest from "../models/FriendRequestSchemas.js";
import * as chatServices from "./chatServices.js";
import sendResponse from "../helper/sendResponse.helper.js";
import { sendNotification } from "../sockets/socketHandler.js";
import { ERROR } from "../constants/error.js";
import Chat from "../models/ChatSchemas.js";
const handleUpdateStatus = async (userId, status) => {
  try {
    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return false;
    }

    checkUser.isOnline = status;
    await checkUser.save();

    return checkUser.friends;
  } catch {
    return false;
  }
};

const getListFriendsAll = async (userId) => {
  try {
    const listFriends = await User.findById(userId)
      .populate({
        path: "friends",
        select: "_id",
      })
      .then((user) => user.friends.map((friend) => friend));

    return listFriends;
  } catch {
    return [];
  }
};

const handleGetMyProfile = async (userId, res) => {
  try {
    const checkUser = await User.findById(userId).select(
      "-friends -password -__v -createdAt -updatedAt -isGoogle -isAdmin -isBanned"
    );
    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }
    return sendResponse({ res, status: 200, data: checkUser });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleGetUserProfile = async (userId, otherUserId, res) => {
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

    const checkOtherUser = await User.findById(otherUserId).select(
      "-password -__v -createdAt -updatedAt -isGoogle -isAdmin -isBanned"
    );

    if (!checkOtherUser || checkOtherUser.isBanned) {
      return sendResponse({
        res,
        status: 404,
        message: "User not found",
        errorCode: ERROR.USER_NOT_FOUND,
      });
    }

    const isFriend =
      checkUser.friends.includes(otherUserId) &&
      checkOtherUser.friends.includes(userId);

    const mutualFriends = checkUser.friends.filter((friendId) =>
      checkOtherUser.friends.includes(friendId)
    ).length;

    return sendResponse({
      res,
      status: 200,
      data: {
        ...checkOtherUser.toObject(),
        isFriend,
        mutualFriends,
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

const handleGetListFriends = async (userId, cursor, limit, res) => {
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

    const query = { _id: { $in: checkUser.friends }, isBanned: false };

    if (cursor) {
      query._id.$gt = cursor;
    }

    const friends = await User.find(query)
      .select("email displayName avatar tag isOnline")
      .sort({ _id: 1 })
      .limit(limit);

    // const friendsWithChatIds = await Promise.all(
    //   friends.map(async (friend) => {
    //     const chat = await Chat.findOne({
    //       participants: { $all: [userId, friend._id] },
    //     }).select("_id");

    //     return {
    //       ...friend.toObject(),
    //       chatId: chat ? chat._id : null, // Nếu không có chat, trả về null
    //     };
    //   })
    // );

    const userFriends = checkUser.friends.map((id) => id.toString());

    const friendsWithExtraData = await Promise.all(
      friends.map(async (friend) => {
        const friendId = friend._id.toString();

        const chat = await Chat.findOne({
          participants: { $all: [userId, friendId] },
        }).select("_id");

        const friendFriends = friend.friends?.map((id) => id.toString()) || [];

        const mutualFriends = userFriends.filter((id) =>
          friendFriends.includes(id)
        ).length;

        return {
          ...friend.toObject(),
          chatId: chat ? chat._id : null,
          mutualFriends,
        };
      })
    );

    const nextCursor =
      friends.length == limit ? friends[friends.length - 1]._id : null;

    return sendResponse({
      res,
      status: 200,
      data: {
        friends: friendsWithExtraData,
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

const handleGetListFriendsRequest = async (
  userId,
  type,
  scope,
  cursor,
  limit,
  res
) => {
  try {
    let friendsRequest = [];
    let query = {};

    const checkUser = await User.findById(userId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    if (scope === "other") {
      query = { fromUserId: userId, status: type };

      if (cursor) {
        query["_id"] = { $gt: cursor };
      }

      friendsRequest = await FriendRequest.find(query)
        .populate({
          path: "toUserId",
          select: "username displayName avatar tag isOnline",
        })
        .select("fromUserId")
        .sort({ _id: 1 })
        .limit(limit);
    } else if (scope === "me") {
      query = { toUserId: userId, status: type };

      if (cursor) {
        query["_id"] = { $gt: cursor };
      }

      friendsRequest = await FriendRequest.find(query)
        .populate({
          path: "fromUserId",
          select: "username displayName avatar tag isOnline friends",
        })
        .select("toUserId")
        .sort({ _id: 1 })
        .limit(limit);
    } else {
      return sendResponse({
        res,
        status: 400,
        message: "Invalid scope",
        errorCode: ERROR.SCOPE_INVALID,
      });
    }

    const userFriends = checkUser.friends.map((id) => id.toString());

    const friendsRequestWithMutual = friendsRequest.map((request) => {
      const otherUser =
        scope === "other" ? request.toUserId : request.fromUserId;

      const otherUserFriends =
        otherUser.friends?.map((id) => id.toString()) || [];

      const mutualFriends = userFriends.filter((id) =>
        otherUserFriends.includes(id)
      ).length;

      return {
        ...request.toObject(),
        mutualFriends,
      };
    });

    const nextCursor =
      friendsRequestWithMutual.length == limit
        ? friendsRequestWithMutual[friendsRequestWithMutual.length - 1]._id
        : null;

    return sendResponse({
      res,
      status: 200,
      data: {
        friendsRequest: friendsRequestWithMutual,
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

const handleSendFriendRequest = async (userId, friendId, res) => {
  try {
    if (userId === friendId) {
      return sendResponse({
        res,
        status: 400,
        message: "You can't send friend request to yourself",
        errorCode: ERROR.SEND_REQ_TO_SELF,
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

    const friend = await User.findById(friendId);

    if (!friend || friend.isBanned) {
      return sendResponse({ res, status: 404, message: "Friend not found" });
    }

    if (checkUser.friends.includes(friendId)) {
      return sendResponse({
        res,
        status: 400,
        message: "You are already friends with this user",
        errorCode: ERROR.FRIEND_ALREADY,
      });
    }

    const friendRequest = await FriendRequest.findOne({
      fromUserId: userId,
      toUserId: friendId,
      status: "pending",
    });

    if (friendRequest) {
      return sendResponse({
        res,
        status: 400,
        message: "You have already sent a friend request to this user",
        errorCode: ERROR.FRIEND_REQ_ALREADY,
      });
    }

    const newFriendRequest = new FriendRequest({
      fromUserId: userId,
      toUserId: friendId,
    });

    await newFriendRequest.save();
    await sendNotification(userId, friendId, "friendRequest", "");

    return sendResponse({ res, status: 200, message: "Friend request sent" });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleAcceptFriendRequest = async (userId, frRequestId, res) => {
  try {
    const toUser = await User.findById(userId);

    if (!toUser) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const friendRequest = await FriendRequest.findById(frRequestId);

    if (!friendRequest) {
      return sendResponse({
        res,
        status: 404,
        message: "Friend request not found",
        errorCode: ERROR.FRIEND_REQ_NOT_FOUND,
      });
    }

    if (friendRequest.toUserId.toString() !== userId) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    if (friendRequest.status !== "pending") {
      return sendResponse({
        res,
        status: 400,
        message: "Friend request is not pending",
        errorCode: ERROR.FRIEND_REQ_NOT_PENDING,
      });
    }

    if (toUser.friends.includes(friendRequest.fromUserId)) {
      return sendResponse({
        res,
        status: 400,
        message: "You are already friends with this user",
        errorCode: ERROR.FRIEND_ALREADY,
      });
    }

    const fromUser = await User.findById(friendRequest.fromUserId);

    if (!fromUser) {
      return sendResponse({
        res,
        status: 404,
        message: "User not found",
        errorCode: ERROR.USER_NOT_FOUND,
      });
    }

    toUser.friends.push(friendRequest.fromUserId);
    await toUser.save();

    fromUser.friends.push(friendRequest.toUserId);
    await fromUser.save();

    friendRequest.status = "accepted";
    await friendRequest.save();

    await sendNotification(
      userId,
      friendRequest.fromUserId,
      "acceptFriendRequest",
      ""
    );

    const newChat = await chatServices.handleCreateChat(
      toUser._id,
      fromUser._id,
      res
    );

    return sendResponse({
      res,
      status: 200,
      message: "Friend request accepted",
      data: newChat,
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

const handleRejectFriendRequest = async (userId, frRequestId, res) => {
  try {
    const toUser = await User.findById(userId);
    if (!toUser) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const friendRequest = await FriendRequest.findById(frRequestId);

    if (!friendRequest) {
      return sendResponse({
        res,
        status: 404,
        message: "Friend request not found",
        errorCode: ERROR.FRIEND_REQ_NOT_FOUND,
      });
    }

    if (friendRequest.toUserId.toString() !== userId) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    if (friendRequest.status !== "pending") {
      return sendResponse({
        res,
        status: 400,
        message: "Friend request is not pending",
        errorCode: ERROR.FRIEND_REQ_NOT_PENDING,
      });
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    return sendResponse({
      res,
      status: 200,
      message: "Friend request rejected",
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

const handleUnfriend = async (userId, friendId, res) => {
  try {
    const checkUser = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!checkUser || checkUser.isBanned) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    if (!friend || friend.isBanned) {
      return sendResponse({
        res,
        status: 404,
        message: "User not found",
        errorCode: ERROR.USER_NOT_FOUND,
      });
    }

    if (!checkUser.friends.includes(friendId)) {
      return sendResponse({
        res,
        status: 400,
        message: "You are not friends with this user",
        errorCode: ERROR.FRIEND_NOT_EXIST,
      });
    }

    await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      friendId,
      { $pull: { friends: userId } },
      { new: true }
    );

    return sendResponse({ res, status: 200, message: "Unfriend successful" });
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleSearchUser = async (userId, username, tag, res) => {
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

    const searchUser = await User.findOne({ username, tag }).select(
      "email displayName avatar tag isOnline"
    );

    if (!searchUser || searchUser.isBanned) {
      return sendResponse({
        res,
        status: 404,
        message: "User not found",
        errorCode: ERROR.USER_NOT_FOUND,
      });
    }

    return sendResponse({ res, status: 200, data: searchUser });
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
  handleGetMyProfile,
  handleGetUserProfile,
  handleUpdateStatus,
  getListFriendsAll,
  handleGetListFriends,
  handleGetListFriendsRequest,
  handleSendFriendRequest,
  handleAcceptFriendRequest,
  handleRejectFriendRequest,
  handleUnfriend,
  handleSearchUser,
};
