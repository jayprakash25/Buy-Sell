//create user route for registration and login in typescript
import express from 'express';
import { handleRegister } from '../controllers/userController';
export const userRouter = express.Router();

userRouter.post('/register', handleRegister)