import express from "express";
import userRouter from "./userRoutes";
import chatRouter from "./chatRoutes";
const router = express.Router();

router.use("/user", userRouter);
router.use("/chat", chatRouter);

export default router;
