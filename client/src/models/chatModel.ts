import UserModel from "./userModel";

export interface ChatModel {
  isGroupChat: boolean;
  users: UserModel[];
  _id: string;
  chatName: string;
}

export default ChatModel;
