import mongoose, { ConnectOptions } from 'mongoose';
import config from '../../config/config';
import { log } from 'console';

const MONGODB_URL:string = config.MONGODB_URL || '';

export const mongoDBConnection = async()=>{
    const mgDb = mongoose.connection;
    await mongoose.connect(MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions)
    .then(()=>{
        console.log(`||--- Database connected successfully ${process.pid} ---||`.cyan.underline);
    }).catch((error)=>{
        console.log(`||--- Database Connection Error :: ${process.pid} ${error}`.red.underline);
        process.exit(0);
    });
    mgDb.on('error', console.error.bind(console, 'MongoDB connection error:'));
}
