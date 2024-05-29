import { userService } from "@services/index";
import { toObjectHexString } from "@src/configs/toObjectHexString";
import { INoti } from "@src/dtos/chatDto";
import Chat from "@src/models/chatModel";
import Noti from "@src/models/notiModel";
import User from "@src/models/userModel";
import { randomUUID } from "crypto";
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
  if (isChat.length == 0) {
    return []
  }

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
  console.log(existUser, existChat)

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
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const isChat = await Chat.findOne({ _id: chatId, isGroupChat: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");
;

  if (!isChat) {
    const error = new Error("채팅 없음") as IError;
    error.statusCode = 409;
    throw error;
  } else {
    const joinDateUser = isChat.joinDates.find(x => {
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
        .where({ groupAdmin: {
                $ne : userId
        }})
        .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");


      if (!joinChat) {
        return isChat
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
      ).populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");
;
      return updateChat;
    } else {
      return isChat
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

// 채팅방 공지 생성
const createChatNotification = async (chatId: string, userId: ObjectId, notiContent: string) => {
  const isChat = await Chat.findOne({ _id: chatId, groupAdmin: userId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅 개설자가 아니거나, 채팅이 없음") as IError;
    error.statusCode = 409;
    throw error;
  }
  
  if(isChat.topNoti) 
    isChat.noti[isChat.topNoti].isTop = false;

  const newNoti = {
    _id: randomUUID(),
    isTop: true,
    contents: notiContent,
    createdDate: new Date(),
    updatedDate: new Date(),
  };

  isChat.noti.push(newNoti);
  isChat.topNoti = isChat.noti.length - 1;

  const updatedChat = await isChat.save();

  return updatedChat;
}

// 채팅방 공지 수정
const editChatNotification = async (chatId: string, userId: ObjectId, noticeId: string, notiContent: string, isTop: boolean) => {
  const isChat = await Chat.findOne({ _id: chatId, groupAdmin: userId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅 개설자가 아니거나, 채팅이 없음") as IError;
    error.statusCode = 409;
    throw error;
  }

  const isNoti = isChat.noti.findIndex(noti => noti._id === noticeId);
  if (isNoti == -1) {
    const error = new Error("공지사항 찾을 수 없음") as IError;
    error.statusCode = 404;
    throw error;
  }
  if(isTop && isNoti !== isChat.topNoti) {
    if(isChat.topNoti) 
      isChat.noti[isChat.topNoti].isTop = false;
    isChat.topNoti = isNoti;
  }
  if(isTop != null)
    isChat.noti[isNoti].isTop = isTop;
  isChat.noti[isNoti].contents = notiContent;
  isChat.noti[isNoti].updatedDate = new Date();

  const updateChat = await isChat.save();
  
    if (!updateChat) {
      const error = new Error("공지사항 업데이트 실패") as IError;
      error.statusCode = 500;
      throw error;
    }  
  return updateChat;
}

// 현재 공지 내리기.
const demoteChatNotification = async (chatId: string, userId: ObjectId) => {
  const isChat = await Chat.findOne({ _id: chatId, groupAdmin: userId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅 개설자가 아니거나, 채팅이 없음") as IError;
    error.statusCode = 409;
    throw error;
  }

  const noticeIdx = isChat.topNoti;
  if (noticeIdx === null) {
    const error = new Error("현재 공지가 설정되어 있지 않습니다") as IError;
    error.statusCode = 404;
    throw error;
  }
  
  isChat.noti[noticeIdx].isTop = false;
  isChat.topNoti = null;

  const updatedChat = await isChat.save();
  
  return updatedChat;
}

// 공지 삭제.
const removeChatNotification = async (chatId: string, userId: ObjectId, noticeId: string) => {
  const isChat = await Chat.findOne({ _id: chatId, groupAdmin: userId, isGroupChat: true });
  if (!isChat) {
    const error = new Error("채팅 개설자가 아니거나, 채팅이 없음") as IError;
    error.statusCode = 409;
    throw error;
  }

  if(isChat.topNoti !== null && isChat.noti[isChat.topNoti]._id === noticeId){
    isChat.topNoti = null;
    await isChat.save();
  }

  const deletedNoti = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { noti: { _id: noticeId} } },
    {
      new: true,
    }
  )
  
    if (!deletedNoti) {
      const error = new Error("공지사항 삭제 실패") as IError;
      error.statusCode = 500;
      throw error;
    }  
  return deletedNoti;
}

// 채팅 내 전체 공지 확인
const getAllNoticeInChat = async (chatId: string, userId: ObjectId) => {
  const isChat = await Chat.findOne({ _id: chatId, users: userId, isGroupChat: true });

  if (!isChat) {
    const error = new Error("채팅에 속하지 않았거나, 채팅이 없음.") as IError;
    error.statusCode = 409;
    throw error;
  }

  const notis = isChat.noti || [];
  
  return notis;
}

// 채팅 내 공지 단일 확인
const getNoticeInChat = async (chatId: string, userId: string, noticeId: string) => {
  const isChat = await Chat.findOne({ _id: chatId, users: userId, isGroupChat: true });
  if (!isChat) {
    const error = new Error("채팅에 속하지 않았거나, 채팅이 없음.") as IError;
    error.statusCode = 409;
    throw error;
  }

  const notice = isChat.noti.find(noti => noti._id === noticeId);
  if (!notice) {
    const error = new Error("공지사항 찾을 수 없음") as IError;
    error.statusCode = 404;
    throw error;
  }

  return notice;
}



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
  removeJoinToGroup,
  createChatNotification,
  editChatNotification,
  demoteChatNotification,
  removeChatNotification,
  getAllNoticeInChat,
  getNoticeInChat
};
