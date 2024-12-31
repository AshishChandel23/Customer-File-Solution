
const Handler = {
    SendResponse : (res:any, status:number=200, message:string='Success', data:any=[])=>{
        return res.status(status).json({error:false,success:true,message,data});
    }
};

export default Handler;