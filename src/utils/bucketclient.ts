    import multer, { StorageEngine, Multer } from 'multer';
    import path from 'path';
    import FileClient from './fileclient';

    const BucketClient = (allowedFileTypes: RegExp): Multer => {
    
    const storage: StorageEngine = multer.diskStorage({
        destination: (req, file, cb) => {
            let destinationFolder = req.query.path as string;
            if (!req.query.folderId) {
                console.log("Error Folder Id Missing".red.underline);
                return cb(new Error('folder Id is required'), '');
            }
            if (!destinationFolder) {
                console.log("Error Destination Folder doesn't Provided".red.underline);
                return cb(new Error('Destination folder is required'), '');
            }
            destinationFolder = path.join(FileClient.getStorePath(), destinationFolder);
            cb(null, destinationFolder);
        },
        filename: async(req:any, file, cb) => {
            let destinationFolder = req.query.path as string;
            destinationFolder = path.join(FileClient.getStorePath(), destinationFolder);
            const filename = `${file.originalname.split('.')[0]}_${Date.now()}${path.extname(file.originalname)}`;
            req.fileBody = {filename, path:req.query.path};
            cb(null, filename);
        },
    });

    const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        if (allowedFileTypes.test(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type not allowed: ${file.mimetype}`));
        }
    };

    return multer({
        storage,
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
        fileFilter,
    });
    };

    export default BucketClient;
