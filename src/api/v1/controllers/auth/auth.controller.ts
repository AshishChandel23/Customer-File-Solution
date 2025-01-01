import { NextFunction, Request, Response } from "express";
import Handler from "../../../../shared/handler/handler";
import { AppError } from "../../../../utils/appError";
import UserService from "../../services/user/user.service";
import { loginSchema, registerSchema } from "../../joi/auth";
import AuthSerivce from "../../services/auth/auth.service";
import { TokenClient } from "../../../../utils/token";
import bcrypt from "bcryptjs";

const User = UserService;
const AuthController = {
    register: async(req: Request, res: Response, next: NextFunction):Promise<void>=>{
        try {
            const {name, email, contactNo, password} = req.body;
            const {error} = registerSchema.validate(req.body,{abortEarly:true});
            if(error){
                return next(new AppError(403, error.message));
            }
            await AuthSerivce.findUser({email:email, forLabel:'register'});
            const result = await AuthSerivce.register(req.body);
            Handler.SendResponse(res, 200, 'User register Successfully!', result);
        } catch (error:any) {
            console.log("Auth Controller Register Error ::>>",error);
            next(error);
        }
    },
    login : async(req:Request, res:Response, next:NextFunction):Promise<void>=>{
        try {
            const {email, password} =  req.body;
            const {error} = loginSchema.validate(req.body,{abortEarly:true});
            if(error){
                return next(new AppError(403, error.message));
            }
            const user = await AuthSerivce.findUser({email:email, forLabel:'login'});
            if(user.verified==='No'){
                return next(new AppError(403, `User's not verified yet!`));
            }
            const hasPasswordMatched = bcrypt.compareSync(password, user.password.toString());
            if(!hasPasswordMatched){
                return next(new AppError(403, 'Invalid Credentials!'));
            }
            const token = TokenClient.generateToken({
                userId:user._id,
                accountId:user.accountId,
                name:user.name,
                email:user.email,
                contactNo:user.contactNo,
                role:'USER'
            });
            Handler.SendResponse(res, 200, 'Login Successfully!', {accountId:user.accountId, token});
        } catch (error) {
            console.log("Auth Controller Login Error ::>>",error);
            next(error);
        }
    }
};

export default AuthController;