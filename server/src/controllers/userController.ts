import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import { userService } from "@services/index";
import User from "@src/models/userModel";
import redisClient from "@src/redis/redis-client";
import axios from "axios";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';
const { ObjectId } = mongoose.Types;

interface IError extends Error {
  statusCode: number;
}
async function getUserIdFromAPI() {
    try {
        const response = await axios.get('http://api.dorihun.r-e.kr:8080/user');
      return response.data.user_id;
    } catch (error) {
        console.error('Error fetching user ID from API:', error);
        throw error;
    }
}

function toObjectIdLikeHexString(number: number): string {
    // 숫자를 16진수 문자열로 변환
    const hexString = number.toString(16);
    // 16진수 문자열을 24자리의 문자열로 패딩하여 반환
    return hexString.padStart(24, '0');
}

const saveUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    
    const userId = await getUserIdFromAPI();
    const uuid = uuidv4(); 
    const objectIdLikeHexString = toObjectIdLikeHexString(userId);
    const _id = new ObjectId(objectIdLikeHexString.toString() as string);

    const user = await User.create({
    _id,
    nickname:uuid.substring(0, 10),
    email:uuid.substring(0, 10),
    password:"test",
    pic:"test",
  });

    res.status(201).json(user);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const saveUserKey = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { pk, objectId } = req.body;
    await redisClient.set(pk.toString(), objectId);
    await redisClient.set(objectId, pk);
    res.status(201).json("성공적으로 유저 key를 생성");
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const getUserKey = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { key } = req.query;
    if (key) {
      //@ts-ignore
      await redisClient.get(key as string, (err: any, value: any) => {
        if (!value) {
          const error = new Error("유저 키 발견 안됌") as IError;
          error.statusCode = 404;
          throw error;
        } else {
          res.status(201).json(value);
        }
      });
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const signUpUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { nickname, email, password, pic } = req.body;
    const user = await userService.signUpUser(nickname, email, password, pic);
    res.status(201).json(user);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const signInUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.signInUser(email, password);
    res.status(200).json(user);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const keyword = req.query.search;
    const userId = req.user?._id;
    const users = await userService.getUsers(keyword, userId);
    res.status(200).json(users);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});
export default {
  saveUser,
  saveUserKey,
  getUserKey,
  signUpUser,
  signInUser,
  getUsers,
};
