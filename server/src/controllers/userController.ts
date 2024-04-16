import generateToken from "@configs/generateToken";
import errorLoggerMiddleware from "@middlewares/loggerMiddleware";
import User from "@src/models/userModel";
import userService from "@src/services/userService";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
interface IError extends Error {
  statusCode: number;
}
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
    const keyword = req.query.search
      ? {
          $or: [
            { nickname: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
    const user = await User.find(keyword).find({ _id: { $ne: req.user?._id } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json("발견된 유저 없음");
    }
  } catch (error: any) {
    errorLoggerMiddleware(error as IError, req, res);
    res.status(error.statusCode).json(error.message);
  }
});
export default {
  signUpUser,
  signInUser,
  getUsers,
};
