import { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { chatService } from "@services/index";
import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;

function toObjectHexString(number: any): string {
  // 숫자를 16진수 문자열로 변환
  const hexString = number.toString(16);
  // 16진수 문자열을 24자리의 문자열로 패딩하여 반환
  return hexString.padStart(24, "0").toString();
}
interface IError extends Error {
  statusCode: number;
}
const getChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const reqUseId = req.user?._id;
    if (reqUseId && studyId) {
      const user = await chatService.getChat(studyId, reqUseId);
      res.status(200).json(user);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});
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
    console.log(reqUseId, "reqUseId")
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
    const { studyId, userId, type } = req.body;

    const objectChatId = toObjectHexString(studyId) as string;
    const reqUseId = req.user?._id;
    let objectUserId
    let reqObjectUserId 
    if (type == "join") {
      objectUserId = toObjectHexString(reqUseId) as string;
    } else if (type == "accept") {
      reqObjectUserId = toObjectHexString(reqUseId) as string;
      objectUserId = toObjectHexString(userId) as string;
    }
    if (objectChatId && objectUserId) {
      const updatedGroupChat = await chatService.addToGroup(objectChatId, objectUserId as string, reqObjectUserId);
      res.status(200).json(updatedGroupChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const removeFromGroup = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId, userId } = req.body;
    const objectChatId = toObjectHexString(studyId) as string;
    const reqUseId = req.user?._id;
    const objectReqUserId = toObjectHexString(reqUseId) as string;
    const objectUserId = toObjectHexString(userId) as string;
    if (objectChatId && objectUserId) {
      const updatedGroupChat = await chatService.removeFromGroup(objectChatId, objectReqUserId, objectUserId);
      res.status(200).json(updatedGroupChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const deleteChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const objectChatId = toObjectHexString(Number(studyId)) as string;
    const reqUseId = req.user?._id;
    if (reqUseId && objectChatId) {
      const deleteChat = await chatService.deleteChat(objectChatId, reqUseId);
      res.status(200).json(deleteChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const addJoinToGroup = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const objectChatId = toObjectHexString(studyId) as string;
    const reqUseId = req.user?._id;
    if (reqUseId && objectChatId) {
      const deleteChat = await chatService.addJoinToGroup(objectChatId, reqUseId);
      res.status(200).json(deleteChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

const removeJoinToGroup = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const objectChatId = toObjectHexString(studyId) as string;
    const reqUseId = req.user?._id;
    if (reqUseId && objectChatId) {
      const deleteChat = await chatService.removeJoinToGroup(objectChatId, reqUseId);
      res.status(200).json(deleteChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// 공지 작성 
const createChatNotification = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const { notiContent } = req.body;
    const objectChatId = toObjectHexString(studyId) as string;
    const reqUseId = req.user?._id;
    if (reqUseId && objectChatId) {
      const createNotiChat = await chatService.createChatNotification(objectChatId, reqUseId, notiContent);
      res.status(201).json(createNotiChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// 기존 공지 수정 (noti id)
const editChatNotification = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const { notiId, notiContent, isTop } = req.body;
    const objectChatId = toObjectHexString(studyId) as string;
    const reqUseId = req.user?._id;
    if (reqUseId && objectChatId) {
      const editNotiChat = await chatService.editChatNotification(objectChatId, reqUseId, notiId, notiContent, isTop);
      res.status(200).json(editNotiChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// 공지 내리기 (현재 top을 제거)
const demoteChatNotification = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const objectChatId = toObjectHexString(studyId) as string;
    const reqUseId = req.user?._id;
    if (reqUseId && objectChatId) {
      const demoteNotiChat = await chatService.demoteChatNotification(objectChatId, reqUseId);
      res.status(200).json(demoteNotiChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// 공지 삭제 (noti id)
const removeChatNotification = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const { notiId } = req.query;
    const objectChatId = toObjectHexString(studyId) as string;
    const reqUseId = req.user?._id;
    if (reqUseId && objectChatId && notiId) {
      const removeNotiChat = await chatService.removeChatNotification(objectChatId, reqUseId, notiId as string);
      res.status(200).json(removeNotiChat);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

//전체 공지 확인
const getAllNoticeInChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const objectChatId = toObjectHexString(studyId) as string;
    const reqUseId = req.user?._id;
    if (reqUseId && objectChatId) {
      const notiList = await chatService.getAllNoticeInChat(objectChatId, reqUseId);
      res.status(200).json(notiList);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});

// 단일 공지 확인
const getNoticeInChat = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { studyId } = req.params;
    const { notiId } = req.query;
    const objectChatId = toObjectHexString(studyId) as string;
    const reqUseId = req.user?._id;
    if (reqUseId && objectChatId) {
      const notice = await chatService.getNoticeInChat(objectChatId, reqUseId, notiId as string);
      res.status(200).json(notice);
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});


export default {
  getChat,
  getAccessChat,
  fetchChats,
  createGroupChat,
  addToGroup,
  updateGroupChat,
  removeFromGroup,
  deleteChat,
  addJoinToGroup,
  removeJoinToGroup,
  createChatNotification,
  editChatNotification,
  demoteChatNotification,
  removeChatNotification,
  getAllNoticeInChat,
  getNoticeInChat
};
