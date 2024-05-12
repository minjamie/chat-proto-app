import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import { chatService } from "@services/index";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

function toObjectHexString(number: number): string {
  // 숫자를 16진수 문자열로 변환
  const hexString = number.toString(16);
  // 16진수 문자열을 24자리의 문자열로 패딩하여 반환
  return hexString.padStart(24, "0").toString();
}
interface IError extends Error {
  statusCode: number;
}
const getAccessChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const reqUseId = req.user?._id;
    if (reqUseId) {
      const user = await chatService.getAccessChat(userId, reqUseId);
      res.status(200).json(user);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const fetchChats = asyncHandler(async (req: Request, res: Response) => {
  try {
    const reqUseId = req.user?._id;
    if (reqUseId) {
      const user = await chatService.fetchChats(reqUseId);
      res.status(200).json(user);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const createGroupChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { pk, name, studyId } = req.body;
    const objectChatId = toObjectHexString(studyId) as string;
    const objectUserId = toObjectHexString(pk) as string;
    const chatId = new ObjectId(objectChatId);
    const userId = new ObjectId(objectUserId);

    const groupChat = await chatService.createGroupChat(userId, chatId, name);
    res.status(200).json(groupChat);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const updateGroupChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { chatId, chatName } = req.body;
    const updatedGroupChat = await chatService.updateGroupChat(
      chatId,
      chatName
    );
    res.status(200).json(updatedGroupChat);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const addToGroup = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { chatId, userId } = req.body;
    const updatedGroupChat = await chatService.addToGroup(chatId, userId);
    res.status(200).json(updatedGroupChat);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const removeFromGroup = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { chatId, userId } = req.body;
    const updatedGroupChat = await chatService.removeFromGroup(chatId, userId);
    res.status(200).json(updatedGroupChat);
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

export default {
  getAccessChat,
  fetchChats,
  createGroupChat,
  addToGroup,
  updateGroupChat,
  removeFromGroup,
};
