import UserModel from "@models/userModel";
import ChatModel from "../chatModel";
import MessageModel from "../messageModel";

export interface ChatStateType {
  user: UserModel; 
  setUser: React.Dispatch<React.SetStateAction<UserModel>>; 
  selectedChat?: ChatModel
  setSelectedChat: React.Dispatch<React.SetStateAction<ChatModel | string>>; 
  chats: ChatModel[];
  setChats: React.Dispatch<React.SetStateAction<ChatModel[]>>; 
  notification: MessageModel[];
  setNotification: React.Dispatch<React.SetStateAction<MessageModel[]>>; 
}
