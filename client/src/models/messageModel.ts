import ChatModel from "./chatModel";
import UserModel from "./userModel";

interface MessageModel {
  chat: ChatModel;
  content: string;
  readBy: UserModel[];
  sender: UserModel;
  createAt: Date;
  updatedAt: Date;
  __v: number;
  _id: string;
}

export default MessageModel;
