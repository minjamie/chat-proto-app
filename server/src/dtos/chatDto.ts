import { Document } from "mongoose";
import { Message } from "./messageDto";
import User from "./userDto";

export interface INoti {
  _id: String;
  isTop: boolean,
  contents: string
}

export interface IJoinDates {
  userId: string,
  joinedDate: Date,
  updatedDate: Date,
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
  topNoti: number | null;
  joinDates: IJoinDates[]
}

export default interface IChatDocument extends IChat, Document {}


export interface ChatResponseDTO {
  chatId: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  latestMessage?: Message;
  groupAdmin: User;
  isDeleted: boolean
  topNoti: INoti;
  joinDates: IJoinDates[]
}