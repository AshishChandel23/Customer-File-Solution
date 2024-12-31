import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  contactNo: string;
  password: string;
  role: string; 
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    accountId: {
        type: String,
        required: [true, 'Account id is required'],
        trim: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Email format is invalid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [5, 'Password must be at least 5 characters long'],
    },
    contactNo:{
        type:Number,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    verified:{
        type: String,
        enum: ['Verified', 'No'],
        default: 'No'
    }
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
