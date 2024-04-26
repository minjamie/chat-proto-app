import generateToken from "@configs/generateToken";
import User from "@src/models/userModel";
import redisClient from "@src/redis/redis-client";

interface IError extends Error {
  statusCode: number;
}

const saveUserKey = async (userPK: string, userObjectId: string) => {
  const savedUserPK = await redisClient.set(userPK.toString(), userObjectId);
  const savedUserObjectId = await redisClient.set(userObjectId, userPK);
  if (savedUserPK && savedUserObjectId)
    return {
      savedUserPK,
      savedUserObjectId,
    };
  else {
    const error = new Error("유저 키 생성 안됌") as IError;
    error.statusCode = 500;
    throw error;
  }
};

const getUserKey = async (userPK: string, userObjectId: string) => {
  let userKey;
  if (userPK) {
    userKey = await redisClient.get(userPK);
  } else {
    userKey = await redisClient.get(userObjectId);
  }
  if (!userKey) {
    const error = new Error("유저 키 발견 안됌") as IError;
    error.statusCode = 404;
    throw error;
  } else {
    return userKey;
  }
};

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
export default { saveUserKey, getUserKey, signUpUser, signInUser, getUsers };
function next() {
  throw new Error("Function not implemented.");
}
