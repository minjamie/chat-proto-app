import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import { chatService } from "@services/index";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

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
    const { users, name } = req.body;
    const reqUser = req.user;
    if (reqUser) {
      const groupChat = await chatService.createGroupChat(users, name, reqUser);
      res.status(200).json(groupChat);
    }
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
