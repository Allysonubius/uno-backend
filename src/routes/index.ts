import { Router } from 'express';
import { router as roomsRouter } from './rooms';
import { router as authRouter } from './authentication';
import { router as profileRouter } from './profile';
import { router as userRouter } from './user';

export const router = Router();

router.use('/rooms', roomsRouter);
router.use('/authentication', authRouter);
router.use('/profile', profileRouter);
router.use('/users', userRouter);
