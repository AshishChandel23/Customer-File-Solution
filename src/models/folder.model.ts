import mongoose, { Schema, Document } from 'mongoose';

export interface IFolder extends Document {
  userId: string; 
  name: string; 
  path: string; // Absolute or relative path in the filesystem
  createdBy: string; 
  parentFolder: string | null; 
  childFolder: Array<unknown> | null;
  createdAt: Date; 
  updatedAt: Date;
}

const FolderSchema: Schema = new Schema(
  {
    userId: {type: String, required: true},
    name: { type: String, required: true, unique: true },
    path: { type: String, required: true },
    createdBy: { type: String },
    parentFolder: { type: Schema.Types.ObjectId, ref: 'Folder', default: null }, 
    childFolder: [{ type: Schema.Types.ObjectId, ref: 'Folder' }]
  },
  {
    timestamps: true,
  }
);

FolderSchema.pre('deleteOne', { document: false, query: true }, async function (next) {
    const folderId = this.getQuery()?._id;
    if (folderId) {
      const childFolders = await mongoose.model('Folder').find({ parentFolder: folderId });
      for (let child of childFolders) {
          await mongoose.model('Folder').deleteOne({ _id: child._id }); 
      }
    }
    next();
});

const FolderModel = mongoose.model<IFolder>('Folder', FolderSchema);
export default FolderModel;
