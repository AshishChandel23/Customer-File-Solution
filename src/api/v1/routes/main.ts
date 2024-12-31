import express from "express";
import UserRouter from './user/index';
import AuthRouter from './auth/auth';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);

export default router;