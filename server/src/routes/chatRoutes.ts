import { chatController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";
import express from "express";
const router = express.Router();
router.get("/", protect, chatController.fetchChats);
router.post("/", protect, chatController.getAccessChat);
router.post("/study", chatController.createGroupChat);
router.put("/group", protect, chatController.updateGroupChat);
router.put("/group/remove", protect, chatController.removeFromGroup);
router.put("/group/add", protect, chatController.addToGroup);

export default router;
