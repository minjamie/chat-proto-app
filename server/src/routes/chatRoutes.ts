import { chatController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";
import express from "express";
const router = express.Router();
router.get("/", protect, chatController.getAccessChat);
router.post("/", protect, chatController.fetchChats);
router.post("/group", protect, chatController.createGroupChat);
router.put("/group", protect, chatController.updateGroupChat);
router.delete("/group", protect, chatController.deleteGroupChat);
router.post("/group/add", protect, chatController.addToGroup);

export default router;
