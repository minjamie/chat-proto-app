import { chatController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";
import express from "express";
const router = express.Router();
router.get("/", chatController.getChats);

export default router;
