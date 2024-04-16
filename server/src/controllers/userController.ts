import generateToken from "@configs/generateToken";
import User from '@src/models/userModel';
import asyncHandler from 'express-async-handler';
const signUpUser = asyncHandler(async (req, res) => {

  const { nickname, email, password, pic } = req.body
  
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
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error("발견된 유저없음");
  }
});

const signInUser = asyncHandler(async (req, res) => {
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

export default {
  signUpUser,
  signInUser
};
