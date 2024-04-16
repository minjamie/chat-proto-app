import { userController } from "@controllers/index";
import { protect } from "@middlewares/authMiddleware";
import express from "express";

const router = express.Router();
router.get("/", protect, userController.getUsers);
router.post("/sign-up", userController.signUpUser);
router.post("/sign-in", userController.signInUser);

export default router;
