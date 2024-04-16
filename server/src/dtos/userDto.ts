import { Document, Model } from "mongoose";

interface IUser {
  nickname: string;
  email: string;
  password: string;
  pic: string;
  isAdmin: false;
}

export default interface IUserDocument extends IUser, Document {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

interface IUserModel extends Model<IUserDocument> {
    findByUsername: (username: string) => Promise<IUserDocument>;
}