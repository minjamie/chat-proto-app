import generateToken from "@configs/generateToken";
import User from "@src/models/userModel";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

interface IError extends Error {
  statusCode: number
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

const signInUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      nickname: user.nickname,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const keyword = req.query.search
    ? {
        $or: [
          { nickname: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const user = await User.find(keyword).find({ _id: { $ne: req.user?._id } });
  res.json(user);
});
export default {
  signUpUser,
  signInUser,
  getUsers,
};
