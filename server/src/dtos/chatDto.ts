import { Document } from "mongoose";
import { Message } from "./messageDto";
import User from "./userDto";

export interface INoti {
  isTop: boolean,
  contents: string,
  createdDate: Date,
  updatedDate: Date
}

interface IJoinDates {
  userId: string,
  joinedDate: Date,
  updatedDate: Date
  isRemoved: boolean,
}

interface IChat {
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage: Message;
  groupAdmin: User;
  isDeleted: boolean
  noti: INoti[]
  joinDates: IJoinDates[]
}
export default interface IChatDocument extends IChat, Document {}
