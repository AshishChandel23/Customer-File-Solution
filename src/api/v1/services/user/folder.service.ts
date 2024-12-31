import { query } from "express";
import FolderModel, { IFolder } from "../../../../models/folder.model";
import { AppError } from "../../../../utils/appError";
import FileClient from "../../../../utils/fileclient";
import path from "path";
import { formatBytes } from "../../../../utils/constant";

const FolderService = {
    createFolder: async(queryObj:any):Promise<IFolder>=>{
        try {
            const parentFolder = queryObj.parentFolder ?
                                     await FolderModel.findById(queryObj.parentFolder)
                                     : null;
            if(queryObj.parentFolder && !parentFolder){
                throw new AppError(403, `Parent Folder Doesn't Exists!`);
            }
            const folder  = await FolderModel.create(queryObj);
            FileClient.createFolder(`${queryObj.path}/${queryObj.name}`);
            if(parentFolder){
                const childFolder = parentFolder?.childFolder ?? [];
                childFolder.push(folder._id);
                await parentFolder?.save();
            }
            return folder;
        } catch (error) {
            throw error;
        }
    },
    getFolder: async(queryObj:any):Promise<IFolder | null>=>{
        try {
            const folder = await FolderModel.findOne({_id:queryObj.folderId, userId:queryObj.userId})
                                            .populate(['parentFolder', 'childFolder']);
            return folder;
        } catch (error) {
            throw error;
        }
    },
    deleteFolder: async(queryObj:any, folderPath:string, parentFolder:any=null):Promise<string>=>{
        try {
            if(parentFolder){
                const update = await FolderModel.updateOne(
                    { _id: parentFolder._id },
                    { $pull: { childFolder: queryObj.folderId } }
                );
            }
            const folder = await FolderModel.deleteOne({_id:queryObj.folderId});
            FileClient.deleteFolder(folderPath);
            return 'Deleted';
        } catch (error) {
            throw error;
        }
    },
    getAllFolder: async(queryObj:any):Promise<IFolder[]>=>{
        try {
            const folders = await FolderModel.find(queryObj)
                                             .populate(['parentFolder', 'childFolder']);
            return folders;
        } catch (error) {
            throw error;
        }
    },
    getFolderStats: async(queryObj:any):Promise<any[]>=>{
        try {
            const folders = await FolderModel.find(queryObj)
                                             .populate(['parentFolder', 'childFolder']);
            const stats = [];
            for(let folder of folders){
                const folderStats = await FileClient.getFolderSize(path.join(folder.path, folder.name));
                stats.push({folderName:folder.name, memoryUsage:formatBytes(folderStats.totalSize), totalFile:folderStats.totalFile});
            }
            return stats;
        } catch (error) {
            throw error;
        }
    },
};

export default FolderService;