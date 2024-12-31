import { NextFunction, Request, Response } from "express";
import Handler from "../../../../shared/handler/handler";
import UserService from "../../services/user/user.service";
import { FolderSchema } from "../../joi/folder";
import { AppError } from "../../../../utils/appError";
import FolderService from "../../services/user/folder.service";
import FileService from "../../services/user/file.service";

import { log } from "console";

const User = UserService;
const FolderController = {
    createFolder: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
            try {
                const tuser = (req as any).user;
                const {error} = FolderSchema.validate(req.body, {abortEarly:true});
                if(error){
                    throw new AppError(403, error.message);
                }
                const queryObj = {
                    userId: tuser.userId,
                    name: req.body.name,
                    path: req.body.path,
                    parentFolder: req.body.parentFolder,
                    createdBy: tuser.name
                };
                const findFolder = await FolderService.getFolder({name:queryObj.name});
                if(findFolder){
                    throw new AppError(403, 'Folder already Exists!');
                }
                const folder = await FolderService.createFolder(queryObj);
                Handler.SendResponse(res, 200, 'Folder Created Successfully!', folder);
            } catch (error) {
                console.log("User Create Folder Error ::>>",error);
                next(error);
            }
    },
    getFolder: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
        try {
            const tuser = (req as any).user;
            if(!req.body.folderId){
                throw new AppError(403, 'Please provide folder Id!');
            }
            const folder = await FolderService.getFolder({userId:tuser.userId, folderId:req.body.folderId});
            if(!folder){
                throw new AppError(403, `Folder Doesn't Exists with this id ${req.body.folderId}!`);
            }
            Handler.SendResponse(res, 200, 'Folder fetched Successfully!', folder);
        } catch (error) {
            console.log("Get folders Error ::>>", error);
            next(error);
        }
    },
    deleteFolder: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
        try {
            if(!req.body.folderId){
                throw new AppError(403, 'Please provide folder Id!');
            } 
            const tuser = (req as any).user;
            const findFolder = await FolderService.getFolder({userId:tuser.userId, folderId:req.body.folderId});
            if(!findFolder){
                throw new AppError(403, `Folder Doesn't Exists with this id ${req.body.folderId}!`);
            }
            // const childFolders: any[] = Array.isArray(findFolder.childFolder)
            //                             ? findFolder.childFolder
            //                             : [];
            // for(let child of childFolders){
            //     console.log("Delete child >>>", child);
            //     await FolderService.deleteFolder({folderId:child._id.toString()}, `${child.path}/${child.name}`, req.body.folderId);
            // }
            const fileQueryObj = {
                userId: tuser.userId, 
                folderId: req.body.folderId
            };  
            const files = await FileService.getAllFile(fileQueryObj);
            for (let file of files){
                await FileService.deleteFile({_id:file._id, userId:tuser.userId}, `${file.path}/${file.name}`);
            }
            const folder = await FolderService.deleteFolder({folderId:req.body.folderId}, `${findFolder.path}/${findFolder.name}`, findFolder.parentFolder);
            Handler.SendResponse(res, 200, 'Folder Deleted Successfully!', "folder");
        } catch (error) {
            console.log("Delete folder Error ::>>", error);
            next(error);
        }
    },
    getAllFolder: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
        try {
            const tuser = (req as any).user;
            const {parentFolder, ...rest} = req.query;

            const queryObj = {
                userId:tuser.userId, 
                parentFolder: parentFolder==='null' ? {$type:10}: parentFolder,
                ...rest
            };            
            const folders = await FolderService.getAllFolder(queryObj);
            Handler.SendResponse(res, 200, 'Folders fetched Successfully!', folders);
        } catch (error) {
            console.log("Get All folders Error ::>>", error);
            next(error);
        }
    },
    allFolder: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
        try {
            const tuser = (req as any).user;
            const queryObj = {
                userId:tuser.userId, 
            };            
            const folders = await FolderService.getAllFolder(queryObj);
            Handler.SendResponse(res, 200, 'Folders fetched Successfully!', folders);
        } catch (error) {
            console.log("All folders Error ::>>", error);
            next(error);
        }
    },
    getFolderStats: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
        try {
            const {folderId} = req.query;
            const tuser = (req as any).user;
            const queryObj = {
                userId: tuser.userId,
                parentFolder: folderId!=='null' ? folderId : {$type:10}
            }
            console.log("QuerObj ::>>>",queryObj);
            const folders = await FolderService.getFolderStats(queryObj);
            Handler.SendResponse(res, 200, 'Folders stats fetched Successfully!', folders);
        } catch (error) {
            console.log("Get User Folder Stats Error ::>>",error);
            next(error);
        }
    },
};

export default FolderController;