import { Document, Model } from "mongoose";
import Chat from "./chatDto";
import User from "./userDto";

interface Message {
  sender?: string;
  content?: string;
  chat: Chat;
  readBy: User;
}

export default interface IMessageDocument extends Message, Document {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}
