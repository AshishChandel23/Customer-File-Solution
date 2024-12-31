import express, {Request, Response, NextFunction} from "express";
import UserController from "../../controllers/user/user.controller";
import Middleware from "../../../../shared/middlewares/middlewares";
import BucketClient from "../../../../utils/bucketclient";
import FileController from "../../controllers/user/file.controller";
import FileClient from "../../../../utils/fileclient";
import multer, { Multer } from "multer";
import { AppError } from "../../../../utils/appError";

const User = UserController;
const File = FileController;
const {verifyToken, verifyUser} = Middleware;
const upload = BucketClient(/image\/(jpeg|png|gif)/).single('bfile');

const router = express.Router();

const handleMulterErrors = (upload: ReturnType<Multer['single']>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        upload(req, res, (err: any) => {
            if (err) {
                console.error("Multer error:", err);
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({
                        success: false,
                        message: `Multer error: ${err.message}`,
                    });
                }
                return next(new AppError(400, err.message));
            }
            next();
        });
    };
}; 


// Use the custom middleware
router.post(
    '/addFile',
    verifyToken,
    verifyUser,
    handleMulterErrors(upload),
    File.addFile
);

router.post('/getFile', verifyToken, verifyUser, File.getFile);
router.delete('/deleteFile', verifyToken, verifyUser, File.deleteFile);
router.get('/getAllFile', verifyToken, verifyUser, File.getAllFile);
router.get('/getFileTypeUsage', verifyToken, verifyUser, File.getFileTypeUsage);

export default router;