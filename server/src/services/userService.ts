import generateToken from "@configs/generateToken";
import User from "@src/models/userModel";

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

const signInUser = async (nickname: string) => {
  const user = await User.findOne({ nickname: nickname });
  if (user) {
    return {
      _id: user._id,
      nickname: user.nickname,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    };
  } else {
    const error = new Error("유저 없음") as IError;
    error.statusCode = 404;
    throw error;
  }
};
const getUsers = async (keyword: any, userId: string) => {
  let filter = {};
  keyword
    ? (filter = {
        $or: [
          { nickname: { $regex: keyword, $options: "i" } },
          { email: { $regex: keyword, $options: "i" } },
        ],
      })
    : (filter = {});
  const users = await User.find(filter).find({ _id: { $ne: userId } });
  if (users) {
    return users;
  } else {
    const error = new Error("발견된 유저 없음") as IError;
    error.statusCode = 404;
    throw error;
  }
};
const getUser = async (userId: any) => {
  console.log(userId)
  const users = await User.findOne({_id: userId});
  if (users) {
    return users;
  } else {
    const error = new Error("발견된 유저 없음") as IError;
    error.statusCode = 404;
    throw error;
  }
};

export default { signUpUser, signInUser, getUsers, getUser };

