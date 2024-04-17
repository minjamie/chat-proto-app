import Chat from "@src/models/chatModel";
import User from "@src/models/userModel";

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
const fetchChats = async (userId: string, reqUseId: string) => {
  const chats = await Chat.find({ users: { $elemMatch: { $eq: reqUseId } } })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage");

  const resultChat = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (resultChat) return resultChat;
  else {
    const error = new Error("1:1 채팅 조회 실패") as IError;
    error.statusCode = 404;
    throw error;
  }
};

const createGroupChat = async (users: string, name: string, reqUser: any) => {
  if (!users || !name) {
    const error = new Error("모든 필드 채워야함") as IError;
    error.statusCode = 400;
    throw error;
  }

  users = JSON.parse(users);
  if (users.length < 2) {
    const error = new Error("그륩 채팅 최대 2명 필요") as IError;
    error.statusCode = 400;
    throw error;
  }

  const createdChat = await Chat.create({
    chatName: name,
    users,
    isGroupChat: true,
    groupAdmin: reqUser,
  });
  if (!createdChat) {
    const error = new Error("그륩 채팅 생성 실패") as IError;
    error.statusCode = 400;
    throw error;
  }
  const fullGroupChat = await Chat.findOne({ _id: createdChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (fullGroupChat) return fullGroupChat;
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
  )
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

export default {
  getAccessChat,
  fetchChats,
  createGroupChat,
  updateGroupChat
};
