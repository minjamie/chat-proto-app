import generateToken from "@configs/generateToken";
import Chat from "@src/models/chatModel";
import Message from "@src/models/messageModel";
import User from "@src/models/userModel";

interface IError extends Error {
  statusCode: number;
}

const getAllMessages = async (chatId: string) => {
  if (!chatId) {
    const error = new Error("chatId 확인") as IError;
    error.statusCode = 400;
    throw error;
  } else {
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "nickname pic email")
      .populate("chat");

    if (messages) return messages;
    else {
      const error = new Error("메시지 조회 실패") as IError;
      error.statusCode = 404;
      throw error;
    }
  }
};

const sendMessage = async (
  content: string,
  chatId: string,
  reqUserId: string
) => {
  if (!content || !chatId) {
    const error = new Error("유효하지 않은 요청") as IError;
    error.statusCode = 400;
    throw error;
  }

  const newMessage = {
    sender: reqUserId,
    content,
    chat: chatId,
  };
  let message = await Message.create(newMessage);
  message = await (
    await message.populate("sender", "nickname pic")
  ).populate("chat");

  const result = await User.populate(message, {
    path: "chat.users",
    select: "nickname pic email",
  });

  if (result) {
    await Chat.findByIdAndUpdate(chatId, { latestMessage: result });
    return result;
  } else {
    const error = new Error("메시지 전송에 실패") as IError;
    error.statusCode = 500;
    throw error;
  }
};

export default {
  getAllMessages,
  sendMessage,
};
