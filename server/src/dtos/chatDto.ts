import { Document } from "mongoose";
import { Message } from "./messageDto";
import User from "./userDto";

interface IChat {
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage: Message;
  groupAdmin: User;
  isDeleted:boolean
}
export default interface IChatDocument extends IChat, Document {}
