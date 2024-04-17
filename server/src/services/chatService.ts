import Chat from "@src/models/chatModel";
import User from "@src/models/userModel";

interface IError extends Error {
  statusCode: number;
}
const getAccessChat = async (userId: string, reqUseId: string) => {
  if (!userId) {
    const error = new Error("없는 유저 id") as IError;
    error.statusCode = 404;
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

  if (resultChat.length > 0) {
    return isChat[0];
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [reqUseId, userId],
    };

    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    if (FullChat) return FullChat;
    else {
      const error = new Error("발견된 채팅 없음") as IError;
      error.statusCode = 404;
      throw error;
    }
  }
};

export default {
  getAccessChat,
};
