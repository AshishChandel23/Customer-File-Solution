import mongoose from "mongoose";
import UserModel, { IUser } from "../../../../models/user.model";
import { generateAccountId } from "../../../../utils/constant";
import bcrypt from "bcryptjs";
import { IRegister } from "../../types/auth.interface";
import { AppError } from "../../../../utils/appError";
import FileClient from "../../../../utils/fileclient";

const AuthSerivce = {
    register:async(queryObj:IRegister)=>{
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(queryObj.password.toString(), salt);
            const registerObj = {
                accountId:generateAccountId('UFS'),
                name:queryObj.name,
                email:queryObj.email,
                contactNo:queryObj.contactNo,
                password:hash,
                isVerified:false,
                address:[],
                wishlist:[]
            };
            const newUser = await UserModel.create(registerObj);
            FileClient.createFolder(`${registerObj.accountId}`);
            await session.commitTransaction();
            session.endSession();
            return newUser;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    },
    findUser:async(queryObj:any):Promise<any>=>{
        try {
            const {email, forLabel} = queryObj;
            const getUser = await UserModel.findOne({email});
            if(forLabel==="register" && getUser){
                throw new AppError(403, 'User Already Exist!');
            }
            if(forLabel==="login" && !getUser){
                throw new AppError(403, `User doesn't Exist!`);
            }
            return getUser;
        } catch (error) {
            throw error;
        }
    }
};

export default AuthSerivce;