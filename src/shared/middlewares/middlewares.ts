import express, {Request, Response, NextFunction, ErrorRequestHandler} from "express";
import config from "../../config/config";
import { AppError } from "../../utils/appError";
import JWT  from "jsonwebtoken";
import { TokenClient } from "../../utils/token";

const Middleware = {
    UnhandleRouteMiddleware : ( req: Request, res: Response, next: NextFunction) => {
        return next(new AppError(404, `Route not Found for [${req.method}] ${req.url}`));
    },
    ErrorMiddleware : ((error: AppError, req: Request, res: Response, next: NextFunction) => {
        const errorMessage: string = error.errorMessage || 'Internal Server Error';
        const errorStatus: number = error.errorStatus || 500;
        const errorResponse = {
            error: true,
            success: false,
            status: errorStatus,
            message: errorMessage,
            ...(config.ENVIORNMENT === 'DEV' && { stack: error.stack }),
        };
        return res.status(errorStatus).json(errorResponse);
    }) as unknown as ErrorRequestHandler,
    verifyToken : async(req:Request, res:Response, next:NextFunction)=>{
        const token:string = req.header('x-access-token') ?? '';
        if(!token){
            return next(new AppError(403, `You aren't authenticated!`));
        }
        const decryptToken = TokenClient.decryptToken(token);
        JWT.verify(decryptToken, config.JWT_SECRET_KEY, (error:any, user:any)=>{
            if(error){
                return next(new AppError(403, `Token is not valid!`));
            }
            (req as any).user = user;
            next();
        });
    },
    verifyUser : async(req:any, res:Response, next:NextFunction)=>{
        if(!req?.user?.role || req?.user?.role!=='USER'){
            return next(new AppError(403, `You aren't authorized User!`));
        }
        next();
    },
    verifyAdmin : async(req:any, res:Response, next:NextFunction)=>{
        if(!req?.user?.role || req?.user?.role!=='ADMIN'){
            return next(new AppError(403, `You aren't authorized Staff!`));
        }
        next();
    },
};

export default Middleware;