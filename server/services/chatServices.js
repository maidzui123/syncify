import { User } from "../models/UserSchemas.js";
import Chat from "../models/ChatSchemas.js";
import Message from "../models/MesssageSchemas.js";
import sendResponse from "../helper/sendResponse.helper.js";
import { ERROR } from "../constants/error.js";
import { sendMessageChat } from "../sockets/socketHandler.js";

const handleCreateChat = async (userId, otherUserId, res) => {
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

    const checkOtherUser = await User.findById(otherUserId);

    if (!checkOtherUser) {
      return sendResponse({
        res,
        status: 404,
        message: "User not found",
        errorCode: ERROR.USER_NOT_FOUND,
      });
    }

    const checkChat = await Chat.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (checkChat) {
      return checkChat;
    }

    const newChat = new Chat({
      participants: [userId, otherUserId],
    });

    await newChat.save();

    return newChat;
  } catch (error) {
    return sendResponse({
      res,
      status: 500,
      message: error.message,
      errorCode: ERROR.SERVER_ERROR,
    });
  }
};

const handleCreateChatTest = async (userId, otherUserId, res) => {
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

    const checkOtherUser = await User.findById(otherUserId);

    if (!checkOtherUser) {
      return sendResponse({
        res,
        status: 404,
        message: "User not found",
        errorCode: ERROR.USER_NOT_FOUND,
      });
    }

    const checkChat = await Chat.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (checkChat) {
      return sendResponse({
        res,
        status: 200,
        message: "Create chat successfully",
        content: checkChat,
      });
    }

    const newChat = new Chat({
      participants: [userId, otherUserId],
    });

    await newChat.save();

    return sendResponse({
      res,
      status: 200,
      message: "Create chat successfully",
      content: newChat,
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

const handleSendMessage = async (
  userId,
  chatId,
  message,
  type,
  socketId,
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

    const checkChat = await Chat.findById(chatId);

    if (!checkChat) {
      return sendResponse({
        res,
        status: 404,
        message: "Chat not found",
        errorCode: ERROR.CHAT_NOT_FOUND,
      });
    }

    if (checkChat.participants.indexOf(userId) === -1) {
      return sendResponse({
        res,
        status: 401,
        message: "Access Denied",
        errorCode: ERROR.ACCESS_DENIED,
      });
    }

    const receiverId = checkChat.participants.find(
      (participant) => participant.toString() !== userId.toString()
    );

    const newMessage = new Message({
      chatId,
      senderId: userId,
      receiverId,
      type: type,
      content: message,
    });

    await newMessage.save();

    const formattedMessage = {
      _id: newMessage._id,
      chatId: newMessage.chatId,
      senderId: newMessage.senderId,
      receiverId: newMessage.receiverId,
      content: newMessage.content,
      type: newMessage.type,
      isSender: true,
      createdAt: newMessage.createdAt,
    };

    const msgData = {
      _id: newMessage._id,
      chatId: newMessage.chatId,
      senderId: {
        _id: checkUser._id,
        avatar: checkUser.avatar,
        displayName: checkUser.displayName,
      },
      receiverId: receiverId,
      content: newMessage.content,
      type: newMessage.type,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
      isSender: false,
    };

    const chatData = {
      chatId: newMessage.chatId,
      lastMessage: {
        content: newMessage.content,
        senderId: newMessage.senderId,
        createdAt: newMessage.createdAt,
      },
      otherParticipant: {
        _id: checkUser._id,
        avatar: checkUser.avatar,
        displayName: checkUser.displayName,
        isOnline: checkUser.isOnline,
      },
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
    };

    const sendData = {
      msgData: msgData,
      chatData: chatData,
    };
    
    await sendMessageChat(chatId, socketId, sendData);

    return sendResponse({
      res,
      status: 200,
      message: "Send message successfully",
      content: formattedMessage,
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

const handleGetAllChats = async (userId, cursor, limit, res) => {
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

    if (cursor) {
      cursor = await Chat.findById(cursor).lean();
      if (!cursor) {
        return sendResponse({
          res,
          status: 400,
          message: "Invalid cursor",
          errorCode: ERROR.INVALID_CURSOR,
        });
      }

      const lastMessage = await Message.findOne({ chatId: cursor._id })
        .sort({ createdAt: -1 })
        .lean();

      cursor.lastMessageCreatedAt = lastMessage
        ? lastMessage.createdAt
        : cursor.createdAt;
    }

    // Aggregation Pipeline
    const aggregationPipeline = [
      {
        $match: { participants: checkUser._id },
      },
      {
        $lookup: {
          from: "messages",
          let: { chatId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$chatId", "$$chatId"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 },
          ],
          as: "lastMessage",
        },
      },

      {
        $addFields: {
          lastMessageCreatedAt: {
            $cond: {
              if: { $gt: [{ $size: "$lastMessage" }, 0] },
              then: { $arrayElemAt: ["$lastMessage.createdAt", 0] },
              else: "$createdAt",
            },
          },
        },
      },
      { $sort: { lastMessageCreatedAt: -1 } },
      {
        $match: cursor
          ? {
              $or: [
                { lastMessageCreatedAt: { $lt: cursor.lastMessageCreatedAt } },
                {
                  $and: [
                    {
                      lastMessageCreatedAt: {
                        $eq: cursor.lastMessageCreatedAt,
                      },
                    },
                    { _id: { $lt: cursor._id } },
                  ],
                },
              ],
            }
          : {},
      },
      {
        $limit: Number(limit),
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participants",
        },
      },
      {
        $project: {
          _id: 1,
          participants: {
            _id: 1,
            displayName: 1,
            avatar: 1,
            isOnline: 1,
          },
          lastMessage: {
            content: 1,
            senderId: 1,
            createdAt: 1,
          },
          lastMessageCreatedAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const chats = await Chat.aggregate(aggregationPipeline);

    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find(
        (participant) => participant._id.toString() !== userId
      );

      return {
        chatId: chat._id,
        lastMessage: chat.lastMessage[0] || {},
        otherParticipant: otherParticipant
          ? {
              _id: otherParticipant._id,
              displayName: otherParticipant.displayName,
              avatar: otherParticipant.avatar,
              isOnline: otherParticipant.isOnline,
            }
          : null,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      };
    });

    const nextCursor =
      formattedChats.length == limit
        ? formattedChats[formattedChats.length - 1].chatId
        : null;

    return sendResponse({
      res,
      status: 200,
      data: { chats: formattedChats, nextCursor },
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

const handleGetAllMessages = async (userId, chatId, cursor, limit, res) => {
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

    const checkChat = await Chat.findById(chatId);

    if (!checkChat) {
      return sendResponse({
        res,
        status: 404,
        message: "Chat not found",
        errorCode: ERROR.CHAT_NOT_FOUND,
      });
    }

    const query = cursor
      ? { chatId: chatId, _id: { $lt: cursor } }
      : { chatId: chatId };

    const messages = await Message.find(query)
      .select(" -__v")
      .populate({ path: "senderId", select: "displayName avatar" })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const formattedMessages = messages.map((message) => ({
      ...message,
      isSender: message.senderId._id == userId,
    }));

    const nextCursor =
      formattedMessages.length == limit ? formattedMessages[0]._id : null;

    return sendResponse({
      res,
      status: 200,
      data: { messages: formattedMessages, nextCursor },
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

const getListRoomChat = async (userId) => {
  const listRoomChat = await Chat.find({ participants: userId }).lean();
  return listRoomChat;
};

// const handleDeleteChat = async (req, res) => {
//   try {
//     return;
//   } catch (error) {
//     return sendResponse({
//       res,
//       status: 500,
//       message: error.message,
//       errorCode: ERROR.SERVER_ERROR,
//     });
//   }
// };
export {
  handleCreateChat,
  handleCreateChatTest,
  handleSendMessage,
  handleGetAllChats,
  handleGetAllMessages,
  getListRoomChat,
  // handleDeleteChat,
};
