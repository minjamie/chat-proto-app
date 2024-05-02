import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import User from "@src/models/userModel";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";
import {
  getUserIdFromAPI,
  toObjectIdLikeHexString,
  IError,
} from "./userController";

const saveUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { objectId, nickname, profileImage } = req.body;
    const userId = await getUserIdFromAPI();
    const uuid = uuidv4();
    const objectIdLikeHexString = toObjectIdLikeHexString(userId);
    const _id = new ObjectId(objectIdLikeHexString.toString() as string);

    const user = await User.create({
      _id,
      nickname,
      pic: "test",
    });

    res.status(201).json(user);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});
