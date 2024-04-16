import { Document, Model } from "mongoose";

interface IUser {
  nickname?: string;
  email?: string;
  password: string;
  pic: string;
  isAdmin: boolean;
}

export default interface IUserDocument extends IUser, Document {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}
