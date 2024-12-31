import { NextFunction, Request, Response } from "express";
import Handler from "../../../../shared/handler/handler";
import UserService from "../../services/user/user.service";
import FolderService from "../../services/user/folder.service";

const User = UserService;
const Folder = FolderService;
const UserController = {
    getUser: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
            try {
                const tuser = (req as any).user;
                const user = await User.getUserByEmail({email:tuser.email});
                Handler.SendResponse(res, 200, 'User fetched Successfully!', user);
            } catch (error) {
                console.log("Get User Error ::>>",error);
                next(error);
            }
    },
};

export default UserController;