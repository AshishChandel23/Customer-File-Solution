import express from "express";
import Middleware from "../../../../shared/middlewares/middlewares";
import FolderController from "../../controllers/user/folder.controller";

const Folder = FolderController;
const {verifyToken, verifyUser} = Middleware;
const router = express.Router();

router.post('/createFolder', verifyToken, verifyUser, Folder.createFolder);
router.post('/getFolder', verifyToken, verifyUser, Folder.getFolder);
router.get('/folders', verifyToken, verifyUser, Folder.getAllFolder);
router.delete('/deleteFolder', verifyToken, verifyUser, Folder.deleteFolder);
router.get('/allFolderList', verifyToken, verifyUser, Folder.allFolder);
router.get('/getFolderStats', verifyToken, verifyUser, Folder.getFolderStats);

export default router;