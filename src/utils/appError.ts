
export class AppError extends Error{
    errorStatus:number=500;
    errorMessage: string;
    constructor(status:number, message:string){
        super(message);
        this.errorStatus = status;
        this.errorMessage = message;
    }
}