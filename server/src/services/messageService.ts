import generateToken from "@configs/generateToken";
import Chat from "@src/models/chatModel";
import Message from "@src/models/messageModel";
import User from "@src/models/userModel";

interface IError extends Error {
  statusCode: number;
}

const getAllMessages = async (
  nickname: string,
  email: string,
  password: string,
  pic: string
) => {
  if (!nickname || !email || !password) {
    const error = new Error("필드 확인") as IError;
    error.statusCode = 400;
    throw error;
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("유저 존재") as IError;
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    nickname,
    email,
    password,
    pic,
  });

  if (user) {
    return {
      _id: user._id,
      nickname: user.nickname,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    };
  } else {
    const error = new Error("유저 생성 안됌") as IError;
    error.statusCode = 404;
    throw error;
  }
};

const signInUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      nickname: user.nickname,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    };
  } else {
    const error = new Error("유효하지 않음") as IError;
    error.statusCode = 401;
    throw error;
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
  message = await (await message
    .populate("sender", "nickname pic"))
    .populate("chat")

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
