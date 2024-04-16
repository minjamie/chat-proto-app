import userController from '@controllers/userController';
import express from 'express';

const router = express.Router()
router.post("/sign-up", userController.signUpUser)
router.post("/sign-in", userController.signInUser)

export default router