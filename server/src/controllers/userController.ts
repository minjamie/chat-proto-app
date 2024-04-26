import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import { userService } from "@services/index";
import redisClient from "@src/redis/redis-client";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
interface IError extends Error {
  statusCode: number;
}

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
  saveUserKey,
  getUserKey,
  signUpUser,
  signInUser,
  getUsers,
};
