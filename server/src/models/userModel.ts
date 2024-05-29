import { Schema, model } from "mongoose";

import IUserDocument from "@dtos/userDto";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUserDocument>(
  {
    nickname: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model("User", userSchema);
export default User;
