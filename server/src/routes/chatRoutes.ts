import { chatController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";
import express from "express";
const router = express.Router();
router.get("/", protect, chatController.fetchChats);
router.post("/", protect, chatController.getAccessChat);
router.post("/group", protect, chatController.createGroupChat);
router.put("/group", protect, chatController.updateGroupChat);
router.delete("/group", protect, chatController.removeFromGroup);
router.put("/groupadd", protect, chatController.addToGroup);

export default router;
