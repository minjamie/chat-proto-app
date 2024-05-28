import {
  IError,
  getUserIdFromAPI,
  toObjectIdLikeHexString,
} from "./userController";
import { Request, Response } from "express";

import User from "@src/models/userModel";
import asyncHandler from "express-async-handler";
import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import { v4 as uuidv4 } from "uuid";

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
