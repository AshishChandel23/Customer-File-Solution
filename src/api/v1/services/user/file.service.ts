import FileModel from "../../../../models/file.model";
import { AppError } from "../../../../utils/appError";
import FileClient from "../../../../utils/fileclient";

const FileService = {
    addFile: async(queryObj:any):Promise<any>=>{
        try {
            const file = await FileModel.create(queryObj);
            return file;
        } catch (error) {
            throw error;
        }
    },
    getFile: async(queryObj:any):Promise<any>=>{
        try {
            const file = await FileModel.findOne(queryObj);
            if(!file){
                throw new AppError(403, `File doesn't Exists`);
            }
            return file;
        } catch (error) {
            throw error;
        }
    },
    deleteFile: async(queryObj:any, filePath:string):Promise<any>=>{
        try {
            const file = await FileModel.deleteOne(queryObj);
            FileClient.deleteFile(filePath);
            return "Deleted";
        } catch (error) {
            throw error;
        }
    },
    getAllFile: async(queryObj:any):Promise<any>=>{
        try {
            const files = await FileModel.find(queryObj);
            return files;
        } catch (error) {
            throw error;
        }
    },
    getFileTypeUsage: async(queryObj:any):Promise<any>=>{
        try {
            const files = await FileModel.aggregate([
                {
                  $match: {
                    userId:queryObj.userId
                  }
                },
                {
                  $group: {
                    _id: "$mimeType",
                    memoryUsage: {
                      $sum: "$size"
                    },
                    fileCount: {
                        $sum: 1
                    }
                  }
                },
                {
                    $project: {
                      _id:0,
                      fileType: "$_id",
                      memoryUsage:1,
                      fileCount:1
                    }
                }
              ]);
            return files;
        } catch (error) {
            throw error;
        }
    }
};

export default FileService;