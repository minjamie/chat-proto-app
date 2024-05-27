import { userService } from "@services/index";
import { toObjectHexString } from "@src/configs/toObjectHexString";
import Chat from "@src/models/chatModel";
import User from "@src/models/userModel";
import mongoose, { ObjectId } from 'mongoose';
const { ObjectId } = mongoose.Types;

interface IError extends Error {
  statusCode: number;
}
const getChat = async (studyId: string, userId: string) => {
  if (!studyId) {
    const error = new Error("studyId 필수") as IError;
    error.statusCode = 400;
    throw error;
  }

  const _id = toObjectHexString(studyId)
  const isChat = await Chat.find({
    _id,
    isDeleted: false,
    $and: [
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  const resultChat = await User.populate(isChat, {
    path: "latestMessages.sender",
    select: "name pic email",
  });
  if (resultChat && resultChat?.length > 0) {
    return isChat[0];
  }
};
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
      // { users: { $elemMatch: { $eq: reqUseId } } },
      { users: reqUseId }
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

  const userUpdateAdmin = await User.updateOne({ _id: userId }, { $set: { isAdmin: true } })

  const createdChat = await Chat.create({
    _id: chatId,
    chatName: name,
    users: userUpdateAdmin,
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

const addToGroup = async (chatId: string, userId: string, reqObjectUserId?: string) => { 
  const user = await userService.getUser(userId)
  if (!user) {
    const error = new Error("유저가 존재하지 않음") as IError;
    error.statusCode = 404;
    throw error; 
  }

  const addedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
  )
    .where({ users: {
                $ne : userId
        }})
    .where({ isGroupChat: true })
    .where( reqObjectUserId ? { groupAdmin: reqObjectUserId  } : {})
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    
    if (!addedChat) {
      const error = new Error("그륩 채팅 조회 실패 또는 이미 초대된 유저") as IError;
      error.statusCode = 404;
      throw error;
    } else {
      return addedChat;
    }
}

const removeFromGroup = async (chatId: string, reqUserId: string, userId: string) => { 
  const isAddedUserChat = await Chat.findOne({ _id: chatId, groupAdmin: reqUserId, isGroupChat: true, users: userId });

  if (!isAddedUserChat) {
    const error = new Error("해당 채팅방 없거나 방장 아닌 유저 또는 해당 방에 유저없음") as IError;
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
const deleteChat = async (chatId: string, userId: string) => {
  const isChat = await Chat.findOne({ groupAdmin: userId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("방장 아님") as IError;
    error.statusCode = 409;
    throw error;
  } else {
    const deletedChat = await Chat.updateOne({ _id: chatId }, { $set: { isDeleted: true } });
    if (!deletedChat) {
      const error = new Error("채팅 조회 삭제실패") as IError;
      error.statusCode = 500;
      throw error;
    }
    return deletedChat;
  }
}


const addJoinToGroup = async (chatId: string, userId: string) => {
  const isChat = await Chat.findOne({ _id: chatId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅 없음") as IError;
    error.statusCode = 409;
    throw error;
  } else {
    const joinDateUser = isChat.joinDates.find(async x => {
      const joinUserId = new mongoose.Types.ObjectId(x.userId); 
      return joinUserId.equals(userId);
    });

    if (!joinDateUser) {
      const joinChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: {
            joinDates:
            {
              userId,
              joinedDate: new Date(),
              updatedDate: new Date(),
              isRemoved: false,
            }
          },
        },
        {
          new: true,
        }
      )

      if (!joinChat) {
        const error = new Error("채팅 조회 삭제실패") as IError;
        error.statusCode = 500;
        throw error;
      }
      return joinChat;
    } else if (joinDateUser && joinDateUser.isRemoved) { 
      const updateChat = await Chat.findOneAndUpdate(
        { _id: chatId, "joinDates.userId": userId },
        {
          $set: { 
            "joinDates.$.joinedDate": new Date(),
            "joinDates.$.updatedDate": new Date(),
            "joinDates.$.isRemoved": false,
          }
        },
        { new: true }
      );
      return updateChat;
    } else {
      const error = new Error("이미 추가") as IError;
      error.statusCode = 409;
      throw error;
    }
  }
}


const removeJoinToGroup = async (chatId: string, userId: string) => {
  const isChat = await Chat.findOne({ _id: chatId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅 없음") as IError;
    error.statusCode = 409;
    throw error;
  } else {
  const joinDateUser = isChat.joinDates.find(x => {
      const joinUserId = new mongoose.Types.ObjectId(x.userId); 
      return joinUserId.equals(userId);
    });

    if (joinDateUser) {
      const updateChat = await Chat.findOneAndUpdate(
        { _id: chatId, "joinDates.userId": userId },
        {
          $set: { 
            "joinDates.$.updatedDate": new Date(),
            "joinDates.$.isRemoved": true,
          }
        },
        { new: true }
      );

      if (!updateChat) {
        const error = new Error("채팅 업데이트 실패") as IError;
        error.statusCode = 500;
        throw error;
      }
      return updateChat;
    } else {
      const error = new Error("사용자 없음") as IError;
      error.statusCode = 404;
      throw error;
    }
  }
};

export default {
  getChat,
  getAccessChat,
  fetchChats,
  createGroupChat,
  updateGroupChat,
  addToGroup,
  removeFromGroup,
  deleteChat,
  addJoinToGroup,
  removeJoinToGroup
};
