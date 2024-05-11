import express from "express";
import { handleRegister } from "../controllers/userController";
import { handleLogin } from "../controllers/userController";
export const userRouter = express.Router();

userRouter.post("/register", handleRegister);
userRouter.post("/login", handleLogin);
