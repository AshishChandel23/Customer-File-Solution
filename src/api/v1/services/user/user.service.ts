import UserModel, { IUser } from "../../../../models/user.model";
import { AppError } from "../../../../utils/appError";

const UserService = {
    getUser: async(queryObj:any):Promise<IUser>=>{
        try {
            const user = await UserModel.findOne(queryObj);
            if(!user){
                throw new AppError(403, 'User Not Found!');
            }
            return user;
        } catch (error) {
            throw error;
        }
    },
    getUserByEmail:async(queryObj:any):Promise<Partial<IUser>>=>{
        try {
            const {email} = queryObj;
            const getUser = await UserModel.findOne({email}).select('accountId name email contactNo');
            if(!getUser){
                throw new AppError(403, 'User Not Found!');
            }
            return getUser;
        } catch (error) {
            throw error;
        }
    },
}

export default UserService;