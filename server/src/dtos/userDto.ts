import { Document } from "mongoose";

interface IUser {
  nickname?: string;
  pic: string;
  isAdmin: boolean;
}

export default interface IUserDocument extends IUser, Document {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}
