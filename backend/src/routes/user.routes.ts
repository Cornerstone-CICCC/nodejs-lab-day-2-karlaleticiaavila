import { Router } from 'express';
import userController from '../controllers/user.controller';

const userRouter = Router();

userRouter.post('/signup', userController.addUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/logout', userController.logout);
userRouter.get('/check-auth', userController.getUserByUsername);

export default userRouter;