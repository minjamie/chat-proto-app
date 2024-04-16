import userController from "@controllers/userController";
import { protect } from "@middlewares/authMiddleware";
import express from "express";
const router = express.Router();
router.route("/").get(protect, userController.getUsers);
router.post("/sign-up", userController.signUpUser);
router.post("/sign-in", userController.signInUser);

export default router;
