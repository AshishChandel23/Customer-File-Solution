import express from "express";
import UserRouter from './user';
import FileRouter from './file';
import FolderRouter from './folder';

const router = express.Router();

router.use(UserRouter);
router.use('/file', FileRouter);
router.use('/folder', FolderRouter);

export default router;