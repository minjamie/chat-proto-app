import generateToken from "@configs/generateToken";
import User from "@src/models/userModel";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

interface IError extends Error {
  statusCode: number;
}

const signUpUser = async (
  nickname: string,
  email: string,
  password: string,
  pic: string
) => {
  if (!nickname || !email || !password) {
    const error = new Error("필드 확인") as IError;
    error.statusCode = 400;
    throw error;
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("유저 존재") as IError;
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    nickname,
    email,
    password,
    pic,
  });

  if (user) {
    return {
      _id: user._id,
      nickname: user.nickname,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    };
  } else {
    const error = new Error("유저 생성 안됌") as IError;
    error.statusCode = 404;
    throw error;
  }
};

const signInUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      nickname: user.nickname,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    };
  } else {
    const error = new Error("유효하지 않음") as IError;
    error.statusCode = 401;
    throw error;
  }
};

export default {
  signUpUser,
  signInUser,
};
