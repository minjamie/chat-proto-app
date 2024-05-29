import { chatController } from "@controllers/index";
import express from "express";
import { protect } from "@middlewares/authMiddleware";

const router = express.Router();
router.get("/", protect, chatController.fetchChats);
router.get("/:studyId", protect, chatController.getChat);
router.post("/", protect, chatController.getAccessChat);
router.post("/study", chatController.createGroupChat);
router.put("/group", protect, chatController.updateGroupChat);
router.put("/group/remove", protect, chatController.removeFromGroup);
router.put("/group/add", protect, chatController.addToGroup);
router.put("/join/add/:studyId", protect, chatController.addJoinToGroup);
router.put("/join/remove/:studyId", protect, chatController.removeJoinToGroup);
router.put("/group/:studyId", protect, chatController.deleteChat);

router.post("/group/:studyId/notice", protect, chatController.createChatNotification);
router.put("/group/:studyId/notice", protect, chatController.editChatNotification);
router.patch("/group/:studyId/notice", protect, chatController.demoteChatNotification);
router.delete("/group/:studyId/notice", protect, chatController.removeChatNotification);
router.get("/group/:studyId/notice/all", protect, chatController.getAllNoticeInChat);
router.get("/group/:studyId/notice", protect, chatController.getNoticeInChat);
export default router;
