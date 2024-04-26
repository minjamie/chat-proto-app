import { userController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";
import express from "express";

const router = express.Router();
router.get("/", protect, userController.getUsers);
router.post("/save-key", userController.saveUserKey);
router.get("/save-key", userController.getUserKey);
router.post("/sign-up", userController.signUpUser);
router.post("/sign-in", userController.signInUser);

export default router;
