import express from "express";
import userRouter from "./userRoutes";
import chatRouter from "./chatRoutes";
import messageRouter from "./messageRoutes";
const router = express.Router();

router.use("/user", userRouter);
router.use("/chat", chatRouter);
router.use("/message", messageRouter);

export default router;
