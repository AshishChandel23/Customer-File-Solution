import { NextFunction, Request, Response } from "express";
import Handler from "../../../../shared/handler/handler";
import UserService from "../../services/user/user.service";
import FileService from "../../services/user/file.service";
import { log } from "console";
import { AppError } from "../../../../utils/appError";
import FolderService from "../../services/user/folder.service";
import FileClient from "../../../../utils/fileclient";
import path from "path";

const User = UserService;
const File = FileService;

const FileController = {
    addFile: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
        try {
            const {folderId} = req.query;
            if(!folderId){
                throw new AppError(403, 'Invalid Folder Id!');
            }
            if (!req.file) {
              throw new AppError(403, 'No file uploaded!');
            }
            const tuser = (req as any).user;
            const fileBody = (req as any).fileBody;
            let folder = null;
            if(folderId!==tuser.accountId){
                try {
                    folder = await FolderService.getFolder({folderId:folderId, userId:tuser.userId});
                    if(!folder){
                        throw new AppError(403, 'Folder not found!');
                    }
                } catch (error) {
                    FileClient.deleteFile(path.join(fileBody.path, fileBody.filename));
                    throw error;
                }
            }
            if(folder){
                const folderPath = `${folder.path}/${folder.name}`;
                if(folderPath!==req.query.path){
                    const findFolder = await FolderService.getFolder({path:fileBody.path, userId:tuser.userId});
                    FileClient.deleteFile(path.join(fileBody.path, fileBody.filename));
                    throw new AppError(403, `Folder not found with your given Path ${req.query.path}!`);
                }
            }
            const user = await User.getUser({_id:tuser.userId});
            const queryObj = {
                userId:tuser.userId,
                name: (req as any).fileBody.filename,
                path: req.query.path,
                folderId: folderId!==tuser.accountId ? folderId : null,
                folderName: folderId!==tuser.accountId ? folder?.name : folderId,
                mimeType: req.file.mimetype,
                size: req.file.size,
            };
            const newFile = await File.addFile(queryObj);
            Handler.SendResponse(res, 200, 'File created Successfully!', newFile);
        } catch (error) {
            console.log("Create File Error ::>>",error);
            next(error);
        }
    },
    getFile: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
        try {
            const {fileId} = req.body;
            if(!fileId){
                throw new AppError(403, 'Invalid file id!');
            }
            const tuser = (req as any).user;
            const user = await User.getUser({_id:tuser.userId});
            const queryObj = {
                _id:fileId,
                userId:tuser.userId
            };
            const file = await File.getFile(queryObj);
            Handler.SendResponse(res, 200, 'File fetched Successfully!', file);
        } catch (error) {
            console.log("Get File Error ::>>",error);
            next(error);
        }
    },
    deleteFile: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
        try {
            const {fileId} = req.body;
            if(!fileId){
                throw new AppError(403, 'Invalid file id!');
            }
            const tuser = (req as any).user;
            const user = await User.getUser({_id:tuser.userId});
            const queryObj = {
                _id:fileId,
                userId:tuser.userId
            };
            const findFile = await File.getFile(queryObj);
            const file = await File.deleteFile(queryObj, `${findFile.path}/${findFile.name}`);
            Handler.SendResponse(res, 200, 'File Deleted Successfully!', file);
        } catch (error) {
            console.log("Delete File Error ::>>",error);
            next(error);
        }
    },
    getAllFile: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
        try {
            const tuser = (req as any).user;
            const user = await User.getUser({_id:tuser.userId});
            const {folderId, ...rest} = req.query;
            const queryObj = {
                userId:tuser.userId, 
                folderId: folderId==='null' ? {$type:10}: folderId,
                ...rest
            };  
            const file = await File.getAllFile(queryObj);
            Handler.SendResponse(res, 200, 'Files fetched Successfully!', file);
        } catch (error) {
            console.log("Get All File Error ::>>",error);
            next(error);
        }
    },
    getFileTypeUsage: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
        try {
            const tuser = (req as any).user;
            const user = await User.getUser({_id:tuser.userId});
            const {folderId, ...rest} = req.query;
            const queryObj = {
                userId:tuser.userId, 
            };  
            const file = await File.getFileTypeUsage(queryObj);
            Handler.SendResponse(res, 200, 'Files fetched Successfully!', file);
        } catch (error) {
            console.log("Get All File Error ::>>",error);
            next(error);
        }
    },
};

export default FileController;