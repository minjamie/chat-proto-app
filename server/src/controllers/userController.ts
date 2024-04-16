import generateToken from "@configs/generateToken";
import User from "@src/models/userModel";
import asyncHandler from "express-async-handler";
import { Response, Request } from "express";
const signUpUser = asyncHandler(async (req: Request, res: Response) => {
  const { nickname, email, password, pic } = req.body;

  if (!nickname || !email || !password) {
    res.status(400);
    throw new Error("필드 확인");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("유저 존재");
  }

  const user = await User.create({
    nickname,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      nickname: user.nickname,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("발견된 유저없음");
  }
});

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
});
export default {
  signUpUser,
  signInUser,
  getUsers,
};
