import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  userId: string; 
  name: string;
  path: string; 
  folderId:string,
  folderName:string,
  size: number; 
  mimeType: string; // MIME type of the file (e.g., 'image/jpeg')
  createdAt: Date; 
  updatedAt: Date; 
}

const FileSchema: Schema = new Schema(
  {
    userId: {type: String, required: true},
    name: { type: String, required: true, unique:true },
    path: { type: String, required: true },
    folderId: { type:mongoose.Schema.Types.ObjectId, ref:'Folder'},
    folderName: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const FileModel = mongoose.model<IFile>('File', FileSchema);
export default FileModel;
