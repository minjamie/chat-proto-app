import { messageController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";
import express from "express";

const router = express.Router();

router.route("/:chatId").get(protect, messageController.getAllMessages);
router.route("/").post(protect, messageController.sendMessage);

export default router;
