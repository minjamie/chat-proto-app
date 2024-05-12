import { userService } from "@services/index";
import Chat from "@src/models/chatModel";
import User from "@src/models/userModel";
import mongoose, { ObjectId } from 'mongoose';
const { ObjectId } = mongoose.Types;

interface IError extends Error {
  statusCode: number;
}
const getAccessChat = async (userId: string, reqUseId: string) => {
  if (!userId) {
    const error = new Error("없는 유저 id") as IError;
    error.statusCode = 400;
    throw error;
  }

  const isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: reqUseId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  const resultChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (resultChat && resultChat?.length > 0) {
    return isChat[0];
  } else {
    const createdChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [reqUseId, userId],
    });
    if (!createdChat) {
      const error = new Error("1:1 채팅 생성 실패") as IError;
      error.statusCode = 400;
      throw error;
    }
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    if (FullChat) return FullChat;
    else {
      const error = new Error("1:1 채팅 조회 실패") as IError;
      error.statusCode = 404;
      throw error;
    }
  }
};
const fetchChats = async (reqUseId: string) => {
  const chats = await Chat.find({
    $or: [
      { users: { $elemMatch: { $eq: reqUseId } } },
      { groupAdmin: reqUseId}
    ]
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");

  const resultChat = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "nickname pic email",
  });

  if (resultChat) return resultChat;
  else {
    const error = new Error("1:1 채팅 조회 실패") as IError;
    error.statusCode = 404;
    throw error;
  }
};

const createGroupChat = async (userId: any, chatId: any, name: string) => {
  const existUser = await userService.getUser(userId)
  if(!existUser) {
    const error = new Error("유저 존재하지 않음") as IError;
    error.statusCode = 403;
    throw error;
  }

  const existChat = await Chat.findOne({
    _id: chatId
  })

  if(existChat) {
    const error = new Error("이미 존재하는 채팅방") as IError;
    error.statusCode = 403;
    throw error;
  }

  const createdChat = await Chat.create({
    _id: chatId,
    chatName: name,
    users: userId,
    isGroupChat: true,
    groupAdmin: userId,
  });
  if (!createdChat) {
    const error = new Error("그륩 채팅 생성 실패") as IError;
    error.statusCode = 400;
    throw error;
  }

  if (createdChat) return createdChat;
  else {
    const error = new Error("그륩 채팅 조회 실패") as IError;
    error.statusCode = 404;
    throw error;
  }
};
const updateGroupChat = async (chatId: string, chatName: string) => { 
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  ).where({ isGroupChat: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    const error = new Error("그륩 채팅 조회 실패") as IError;
    error.statusCode = 404;
    throw error;
  } else {
    return updatedChat;
  }
}

const addToGroup = async (chatId: string, userId: string) => { 
  const userObjectId = new ObjectId(userId);

    const addedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    ).where({ isGroupChat: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    
    if (!addedChat) {
      const error = new Error("그륩 채팅 조회 실패") as IError;
      error.statusCode = 404;
      throw error;
    } else {
      return addedChat;
    }
}

const removeFromGroup = async (chatId: string, userId: string) => { 
  const userObjectId = new ObjectId(userId);

  const isAddedUserChat = await Chat.findOne({ users: userObjectId, isGroupChat: true });

  if (!isAddedUserChat) {
    const error = new Error("초대되지 않은 유저") as IError;
    error.statusCode = 409;
    throw error; 
  } else {
    const deletedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    ).where({ isGroupChat: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
      if (!deletedChat) {
        const error = new Error("그륩 채팅 조회 실패") as IError;
        error.statusCode = 404;
        throw error;
      } else {
        if (deletedChat?.users.length == 0) {
          const res = await Chat.updateOne({ _id: chatId }, { $set: { isDeleted: true } });
        }
      return deletedChat;
    }
  }
}

export default {
  getAccessChat,
  fetchChats,
  createGroupChat,
  updateGroupChat,
  addToGroup,
  removeFromGroup        
};
