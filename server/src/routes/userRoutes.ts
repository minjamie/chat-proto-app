import express from "express";
import { protect } from "@middlewares/authMiddleware";
import { userController } from "@controllers/index";

const router = express.Router();
router.get("/", protect, userController.getUsers);
router.post("/", userController.createUser);
router.delete("/:id", userController.deleteUser);
router.patch("/:id", userController.updateUser);
router.get("/save-key", userController.getUserKey);
router.post("/sign-up", userController.signUpUser);
router.post("/sign-in", userController.signInUser);

export default router;
