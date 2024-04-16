import userController from "@controllers/userController";
import express from "express";

const router = express.Router();
router.get("/sign-up", userController.getUsers);
router.post("/sign-up", userController.signUpUser);
router.post("/sign-in", userController.signInUser);

export default router;
