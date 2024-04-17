import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import chatService from "@src/services/chatService";

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
    const { userId } = req.body;
    const reqUseId = req.user?._id;
    if (reqUseId) {
      const user = await chatService.fetchChats(userId, reqUseId);
      res.status(200).json(user);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const createGroupChat = () => {};
const addToGroup = () => {};
const updateGroupChat = () => {};
const deleteGroupChat = () => {};
export default {
  getAccessChat,
  fetchChats,
  createGroupChat,
  addToGroup,
  updateGroupChat,
  deleteGroupChat,
};
