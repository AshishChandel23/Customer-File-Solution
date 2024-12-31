import mongoose from 'mongoose';

export function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
}


export const generateAccountId = (prefix:string, length:number=8):string=>{
    const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
    const randomString = Math.random().toString(36).substring(2, 6);
    return `${prefix}${timestamp}${randomString}`.toUpperCase();
};

export const DateTime = () =>{
    return new Date().toLocaleString(undefined, {timeZone: 'Asia/Kolkata'});
};

export const formatBytes = (bytes: number, targetUnit: string = 'MB'): number => {
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = sizes.indexOf(targetUnit.toUpperCase());
    if (index === -1) {
      throw new Error(`Invalid target unit. Valid units are: ${sizes.join(', ')}`);
    }
    if (bytes === 0) return 0;
    const convertedSize = bytes / Math.pow(1024, index);
    const rounded = Math.round(convertedSize * 100) / 100;     
    return rounded;
};
  
  