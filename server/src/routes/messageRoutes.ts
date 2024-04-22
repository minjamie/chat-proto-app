import express from "express";
import { messageController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";

const router = express.Router();

router.route("/:chatId").get(protect, messageController.getAllMessages);
router.route("/").post(protect, messageController.sendMessage);

export default router;
