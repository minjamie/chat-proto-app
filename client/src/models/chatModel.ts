import MessageModel from './messageModel';
import UserModel from "./userModel";

export interface ChatModel {
  latestMessage: MessageModel;
  isGroupChat: boolean;
  users: UserModel[];
  _id: string;
  chatName: string;
  groupAdmin: UserModel
}

export default ChatModel;
